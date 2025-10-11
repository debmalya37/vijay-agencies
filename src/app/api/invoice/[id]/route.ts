import { generateInvoiceHTML } from "@/lib/InvoiceTemplateHTML";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { IUser } from "@/models/User";
import mongoose from "mongoose";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    await dbConnect();

    const rawId = params.id;
    let order = null;

    // Fetch order by ObjectId or Razorpay order ID
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
        headers: { "Content-Type": "application/json" },
      });
    }

    const buyer = order.userId as IUser;

    const defaultAddress = buyer?.addresses?.find((a) => a.is_default) || buyer?.addresses?.[0];

    const buyerAddress = defaultAddress
      ? [
          defaultAddress.address_line1,
          defaultAddress.address_line2,
          defaultAddress.city,
          defaultAddress.state,
          defaultAddress.country,
          `Pincode: ${defaultAddress.pincode}`,
        ].filter(Boolean).join("<br/>")
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

    // Puppeteer launch optimized for serverless
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true, // Always headless in serverless
      defaultViewport: { width: 1200, height: 800 },
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });
    
    await browser.close();
    
    // Cast pdfBuffer to Buffer to satisfy TypeScript
    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoiceData.invoiceNo}.pdf`,
      },
    });
    
  } catch (error) {
    console.error("Error generating invoice:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate invoice", details: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
