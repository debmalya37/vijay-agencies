"use client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// ✅ Register safe built-in fallback font
Font.register({
  family: "Helvetica",
  fonts: [{ src: "https://fonts.cdnfonts.com/s/15354/Arial.woff", fontWeight: "normal" }],
});

// ✅ Helper: Convert number to Indian words
function numberToWords(num: number): string {
  if (!num || num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  function convertLessThanThousand(n: number): string {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertLessThanThousand(n % 100) : "");
  }
  if (num < 1000) return convertLessThanThousand(num);
  if (num < 100000) return convertLessThanThousand(Math.floor(num / 1000)) + " Thousand " + convertLessThanThousand(num % 1000);
  if (num < 10000000)
    return convertLessThanThousand(Math.floor(num / 100000)) + " Lakh " + convertLessThanThousand(num % 100000);
  return convertLessThanThousand(Math.floor(num / 10000000)) + " Crore " + convertLessThanThousand(num % 10000000);
}

const formatCurrency = (num: number) =>
  `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

interface InvoicePDFProps {
  order?: any;
}

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", padding: 20, fontSize: 9, lineHeight: 1.3 },
  title: { textAlign: "center", fontSize: 14, fontWeight: "bold", marginBottom: 10, textDecoration: "underline" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  section: { marginBottom: 6 },
  table: { width: "100%", borderWidth: 0.5, borderColor: "#000" },
  tableRow: { flexDirection: "row" },
  cell: { borderRightWidth: 0.5, borderColor: "#000", padding: 3 },
  bold: { fontWeight: "bold" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  logo: { width: 50, height: 50, borderRadius: 25, marginBottom: 4 },
});

const InvoicePDF: React.FC<InvoicePDFProps> = ({ order }) => {
  const buyer = order?.buyer || {};
  const invoiceNo = order?.invoiceNo || "N/A";
  const invoiceDate = new Date(order?.date || Date.now()).toLocaleDateString("en-GB");
  const currentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

  // ✅ Map items safely
  const items = Array.isArray(order?.items)
    ? order.items.map((item: any, idx: number) => ({
        sl: idx + 1,
        description: item.title || item.productId?.name || "Product",
        hsn: item.hsn || "48182000",
        gst: item.gst || 18,
        quantity: item.quantity || 0,
        rate: item.price || 0,
        amount: (item.price || 0) * (item.quantity || 0),
      }))
    : [];

  const subtotal = items.reduce((sum: number, i: any) => sum + i.amount, 0);
  const deliveryCharge = subtotal < 50000 ? 150 : 0;
  const grandTotal = subtotal + deliveryCharge;
  const totalQty = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
  const amountInWords = numberToWords(Math.round(grandTotal)) + " Only";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>TAX INVOICE</Text>

        {/* Header Section */}
        <View style={[styles.row, styles.section]}>
          <View>
            <Image style={styles.logo} src="https://www.vijayagenciesjpr.com/X.JPEG.jpg" />
          </View>
          <View style={{ width: "65%" }}>
            <Text style={styles.bold}>Vijay Agencies</Text>
            <Text>A 917 Siddarth Nagar, Near Jain Mandir, Jaipur</Text>
            <Text>Phone: +91-9315630408, 9414073671</Text>
            <Text>GSTIN/UIN: 08AAJPV2631B1Z6</Text>
            <Text>Email: support@vijayagenciesjpr.com</Text>
          </View>
          <View>
            <Text>Invoice No: {invoiceNo}</Text>
            <Text>Date: {invoiceDate}</Text>
          </View>
        </View>

        {/* Buyer Section */}
        <View style={styles.section}>
          <Text style={styles.bold}>Buyer (Bill To)</Text>
          <Text>{buyer.name || "N/A"}</Text>
          <Text>{buyer.address || "N/A"}</Text>
          {buyer.gstin && <Text>GSTIN: {buyer.gstin}</Text>}
          <Text>State: {buyer.state || "N/A"}</Text>
        </View>

        {/* Items Table */}
        <View style={[styles.table, styles.section]}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.bold]}>
            {["Sl", "Description", "HSN", "GST%", "Qty", "Rate", "Amount"].map((h) => (
              <Text key={h} style={[styles.cell, { width: "14.2%", textAlign: "center" }]}>
                {h}
              </Text>
            ))}
          </View>

          {/* Table Rows */}
          {items.length > 0 ? (
            items.map((item:any, idx:any) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.cell, { width: "14.2%" }]}>{item.sl}</Text>
                <Text style={[styles.cell, { width: "14.2%" }]}>{item.description}</Text>
                <Text style={[styles.cell, { width: "14.2%" }]}>{item.hsn}</Text>
                <Text style={[styles.cell, { width: "14.2%", textAlign: "center" }]}>{item.gst}%</Text>
                <Text style={[styles.cell, { width: "14.2%", textAlign: "center" }]}>{item.quantity}</Text>
                <Text style={[styles.cell, { width: "14.2%", textAlign: "right" }]}>{formatCurrency(item.rate)}</Text>
                <Text style={[styles.cell, { width: "14.2%", textAlign: "right" }]}>{formatCurrency(item.amount)}</Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", padding: 8 }}>No items found</Text>
          )}

          {/* Delivery Charge */}
          {deliveryCharge > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.cell, { width: "14.2%" }]}>{items.length + 1}</Text>
              <Text style={[styles.cell, { width: "14.2%" }]}>Delivery Charge</Text>
              <Text style={[styles.cell, { width: "14.2%" }]}>996819</Text>
              <Text style={[styles.cell, { width: "14.2%" }]}></Text>
              <Text style={[styles.cell, { width: "14.2%", textAlign: "center" }]}>1</Text>
              <Text style={[styles.cell, { width: "14.2%", textAlign: "right" }]}>{formatCurrency(deliveryCharge)}</Text>
              <Text style={[styles.cell, { width: "14.2%", textAlign: "right" }]}>{formatCurrency(deliveryCharge)}</Text>
            </View>
          )}

          {/* Totals */}
          <View style={[styles.tableRow, styles.bold]}>
            <Text style={[styles.cell, { width: "71%" }]}>Total</Text>
            <Text style={[styles.cell, { width: "14.2%", textAlign: "center" }]}>{totalQty}</Text>
            <Text style={[styles.cell, { width: "14.2%", textAlign: "right" }]}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.section}>
          <Text>Amount Chargeable (in words):</Text>
          <Text style={styles.bold}>INR {amountInWords}</Text>
        </View>

        {/* Bank Info & Footer */}
        <View style={styles.section}>
          <Text>Date & Time: {invoiceDate} at {currentTime}</Text>
          <Text>Bank: HDFC U Bank OD 9419 | A/c: 22215504423694</Text>
          <Text>Branch: Girdhak Marg | IFSC: AUBL0002550</Text>
        </View>

        <View style={[styles.section, { textAlign: "center", marginTop: 10 }]}>
          <Text>This is a Computer Generated Invoice</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
