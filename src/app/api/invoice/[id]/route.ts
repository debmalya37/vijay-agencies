// File: app/api/invoice/[id]/route.ts
import puppeteer from "puppeteer";
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
    const defaultAddress = buyer?.addresses?.find((a) => a.is_default) || buyer?.addresses?.[0];

    // Format buyer address
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

    // Format invoice data
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
          quantity: item.quantity, // Changed from qty to quantity
          rate: item.price, // Price already includes GST
          gst: product?.gst || 18,
        };
      }),
    };

    // Generate HTML
    const html = generateInvoiceHTML(invoiceData);

    // Generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
    return new Response(pdfBlob, {
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