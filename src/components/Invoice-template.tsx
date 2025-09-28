// components/invoice-template.tsx
import Head from "next/head";
import React from "react";

interface InvoiceProps {
  invoiceNo: string;
  date: string;
  buyer: {
    name: string;
    address: string;
    gstin: string;
    state: string;
  };
  items: {
    description: string;
    hsn: string;
    qty: number;
    rate: number;
    gst: number;
  }[];
  totals: {
    subtotal: number;
    cgst: number;
    sgst: number;
    total: number;
  };
}

export default function InvoiceTemplate({ invoiceNo, date, buyer, items, totals }: InvoiceProps) {
  return (
    <html>
      <Head>
        <style>{`
          body { font-family: Arial, sans-serif; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 4px; text-align: left; }
          .header { text-align: center; font-weight: bold; margin-bottom: 20px; }
        `}</style>
      </Head>
      <body>
        <div className="header">Tax Invoice</div>
        <table>
          <tr>
            <td colSpan={2}>
              <b>Vijay Agencies</b><br/>
              A 917 Siddarth Nagar, Jaipur<br/>
              GSTIN: 08AAJPJ2631B1Z6
            </td>
            <td>
              <b>Invoice No:</b> {invoiceNo}<br/>
              <b>Date:</b> {date}
            </td>
          </tr>
        </table>

        <h4>Buyer Details</h4>
        <p>
          {buyer.name}<br/>
          {buyer.address}<br/>
          GSTIN: {buyer.gstin}<br/>
          State: {buyer.state}
        </p>

        <h4>Items</h4>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>GST %</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{it.description}</td>
                <td>{it.hsn}</td>
                <td>{it.qty}</td>
                <td>{it.rate}</td>
                <td>{it.gst}%</td>
                <td>{(it.qty * it.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4>Totals</h4>
        <table>
          <tr><td>Subtotal</td><td>{totals.subtotal}</td></tr>
          <tr><td>CGST</td><td>{totals.cgst}</td></tr>
          <tr><td>SGST</td><td>{totals.sgst}</td></tr>
          <tr><td><b>Total</b></td><td><b>{totals.total}</b></td></tr>
        </table>
      </body>
    </html>
  );
}
