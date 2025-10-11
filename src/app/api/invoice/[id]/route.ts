import { generateInvoiceHTML } from "@/lib/InvoiceTemplateHTML";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { IUser } from "@/models/User";
import mongoose from "mongoose";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const rawId = params.id;
    let order = null;

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

    const defaultAddress =
      buyer?.addresses?.find((a) => a.is_default) || buyer?.addresses?.[0];

    const buyerAddress = defaultAddress
      ? [
          defaultAddress.address_line1,
          defaultAddress.address_line2,
          defaultAddress.city,
          defaultAddress.state,
          defaultAddress.country,
          `Pincode: ${defaultAddress.pincode}`,
        ]
          .filter(Boolean)
          .join("<br/>")
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

    // ✅ Handle local vs serverless
    let browser;
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const executablePath = await chromium.executablePath();
    
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: executablePath || "/usr/bin/chromium-browser", // fallback path for some hosts
        headless: true, // explicitly set to true (don’t rely on chromium.headless)
      });
    } else {
      const localPuppeteer = (await import("puppeteer")).default;
      browser = await localPuppeteer.launch({
        headless: true,
      });
    }
    

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    await browser.close();

    return new Response(new Blob([Buffer.from(pdfBuffer)], { type: "application/pdf" }), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoiceData.invoiceNo}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return new Response(JSON.stringify({ error: "Failed to generate invoice" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
