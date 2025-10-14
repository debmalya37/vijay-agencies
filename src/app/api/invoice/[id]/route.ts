import { generateInvoiceHTML } from "@/lib/InvoiceTemplateHTML";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { IUser, User } from "@/models/User"; // <-- Import model
import mongoose from "mongoose";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 40;

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    // 1️⃣ Connect to DB
    await dbConnect();

    // 2️⃣ Ensure User model is registered (fix schema error)
    const User = mongoose.models.User || mongoose.model("User");

    const rawId = params.id;
    let order = null;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      order = await Order.findById(rawId)
        .populate<{ userId: IUser }>("userId") // userId will now be populated
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

    // 3️⃣ Use IUser document from populate
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
    ].filter(Boolean)
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

    const executablePath = await chromium.executablePath();
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox",
      ],
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    await browser.close();

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoiceData.invoiceNo}.pdf`,
      },
    });
  } catch (error: any) {
    console.error("❌ Invoice generation error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate invoice",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
