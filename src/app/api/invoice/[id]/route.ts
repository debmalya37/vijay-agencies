// app/api/invoice/[id]/route.ts
import puppeteer from "puppeteer";
import { generateInvoiceHTML } from "@/lib/InvoiceTemplateHTML";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // ✅ Fetch order data from DB (here mocked)
  const order = {
    invoiceNo: "VA/25-26/4383",
    date: "18-Sep-25",
    buyer: {
      name: "Vimal Vilas",
      address: "Plot No 2 Prahlad Colony, Jaipur",
      gstin: "08MAPJ217C1ZS",
      state: "Rajasthan",
    },
    items: [
      { description: "Wet Wipe Tissue", hsn: "48182000", qty: 6000, rate: 1.4, gst: 18 },
      { description: "Paper Glass", hsn: "48236000", qty: 500, rate: 5, gst: 18 },
    ],
    totals: { subtotal: 10900, cgst: 981, sgst: 981, total: 12862 },
  };

  // ✅ Generate HTML
  const html = generateInvoiceHTML(order);

  // ✅ Puppeteer PDF
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return new Response(new Blob([new Uint8Array(pdfBuffer.buffer as ArrayBuffer)], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${order.invoiceNo}.pdf`,
    },
  });
}
