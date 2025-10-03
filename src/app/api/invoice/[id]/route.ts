// File: app/api/invoice/[id]/route.ts
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { generateInvoiceHTML } from "@/lib/InvoiceTemplateHTML";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { IUser } from "@/models/User";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const rawId = params.id;
    let order = null;

    // Find order by MongoDB _id or razorpayOrderId
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      order = await Order.findById(rawId)
        .populate<{ userId: IUser }>("userId")
        .populate("items.productId");
    } else {
      order = await Order.findOne({ razorpayOrderId: rawId })
        .populate<{ userId: IUser }>("userId")
        .populate("items.productId");
    }

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const buyer = order.userId as IUser;

    // Pick default address or first available
    const defaultAddress = buyer?.addresses?.find(a => a.is_default) || buyer?.addresses?.[0];

    const buyerAddress = defaultAddress
      ? [
          defaultAddress.address_line1,
          defaultAddress.address_line2,
          defaultAddress.city,
          defaultAddress.state,
          defaultAddress.country,
          `Pincode: ${defaultAddress.pincode}`
        ].filter(Boolean).join('<br/>')
      : "N/A";

    const invoiceData = {
      invoiceNo: `VA/25-26/${order._id.toString().slice(-6).toUpperCase()}`,
      date: order.createdAt || new Date(),
      buyer: {
        name: buyer?.full_name || buyer?.username || "Customer",
        address: buyerAddress,
        gstin: buyer?.gst_number || "",
        state: defaultAddress?.state || "Rajasthan",
      },
      items: order.items.map((item: any) => {
        const product = item.productId;
        return {
          description: product?.title || "Product",
          hsn: product?.hsn || "",
          quantity: item.quantity,
          rate: item.price,
          gst: product?.gst || 18,
        };
      }),
    };

    const html = generateInvoiceHTML(invoiceData);

    // Launch headless browser using chrome-aws-lambda
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm"
      }
    });

    await browser.close();

    const pdfBlob = new Blob([new Uint8Array((pdfBuffer.buffer as ArrayBuffer).slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength))], { type: "application/pdf" });
    return new Response(pdfBlob,{
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoiceData.invoiceNo}.pdf`,
      },
    });

  } catch (error) {
    console.error("Error generating invoice:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate invoice" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
