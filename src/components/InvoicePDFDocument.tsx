// components/InvoicePDFDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Helper function to convert number to words (Indian format)
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLessThanThousand(n % 100) : '');
  }
  
  if (num < 1000) return convertLessThanThousand(num);
  if (num < 100000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertLessThanThousand(thousands) + ' Thousand' + (remainder ? ' ' + convertLessThanThousand(remainder) : '');
  }
  if (num < 10000000) {
    const lakhs = Math.floor(num / 100000);
    let remainder = num % 100000;
    let result = convertLessThanThousand(lakhs) + ' Lakh';
    if (remainder >= 1000) {
      result += ' ' + convertLessThanThousand(Math.floor(remainder / 1000)) + ' Thousand';
      remainder = remainder % 1000;
    }
    if (remainder > 0) {
      result += ' ' + convertLessThanThousand(remainder);
    }
    return result;
  }
  
  const crores = Math.floor(num / 10000000);
  const remainder = num % 10000000;
  let result = convertLessThanThousand(crores) + ' Crore';
  if (remainder > 0) {
    result += ' ' + numberToWords(remainder);
  }
  return result;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 8,
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 7,
    padding: 3,
  },
  companyHeader: {
    flexDirection: 'row',
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#000',
  },
  logoCell: {
    width: 80,
    padding: 5,
    borderRightWidth: 2,
    borderRightColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyDetails: {
    flex: 1,
    padding: 5,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  invoiceInfo: {
    width: 180,
    padding: 3,
    borderLeftWidth: 1,
    borderLeftColor: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
    fontSize: 8,
  },
  infoLabel: {
    width: '50%',
    fontWeight: 'bold',
  },
  infoValue: {
    width: '50%',
  },
  itemsTable: {
    marginTop: 0,
  },
  itemRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  totalRow: {
    backgroundColor: '#f9f9f9',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textRight: {
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },
  amountSection: {
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#000',
  },
  amountRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  amountLeft: {
    width: '60%',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  amountRight: {
    width: '40%',
    padding: 5,
  },
  taxBreakdownTable: {
    fontSize: 7,
  },
  taxRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  taxCell: {
    flex: 1,
    textAlign: 'right',
    paddingHorizontal: 2,
  },
  bankDetails: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  bankRow: {
    flexDirection: 'row',
  },
  bankLeft: {
    width: '50%',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  bankRight: {
    width: '50%',
    padding: 5,
  },
  signatureSection: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  signatureRow: {
    flexDirection: 'row',
    padding: 10,
  },
  signatureLeft: {
    width: '50%',
  },
  signatureRight: {
    width: '50%',
    textAlign: 'right',
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

interface InvoiceItem {
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  gst: number;
}

interface InvoiceData {
  invoiceNo: string;
  date: Date;
  buyer: {
    name: string;
    address: string;
    gstin: string;
    state: string;
  };
  items: InvoiceItem[];
}

interface InvoicePDFDocumentProps {
  invoiceData: InvoiceData;
}

const InvoicePDFDocument: React.FC<InvoicePDFDocumentProps> = ({ invoiceData }) => {
  // Calculate subtotal
  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  
  // Delivery charge logic
  const deliveryCharge = subtotal < 50000 ? 150 : 0;
  
  // Calculate tax breakdown by HSN
  const hsnBreakdown: { [key: string]: { taxable: number, cgst: number, sgst: number, gstRate: number } } = {};
  
  invoiceData.items.forEach((item) => {
    const hsn = item.hsn || '00000000';
    const gstRate = item.gst || 18;
    const itemTotal = item.rate * item.quantity;
    
    const taxableValue = itemTotal / (1 + gstRate / 100);
    const totalTax = itemTotal - taxableValue;
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;
    
    if (!hsnBreakdown[hsn]) {
      hsnBreakdown[hsn] = { taxable: 0, cgst: 0, sgst: 0, gstRate };
    }
    
    hsnBreakdown[hsn].taxable += taxableValue;
    hsnBreakdown[hsn].cgst += cgst;
    hsnBreakdown[hsn].sgst += sgst;
  });
  
  // Add delivery charge to HSN breakdown
  if (deliveryCharge > 0) {
    const deliveryHSN = '996819';
    const deliveryGST = 18;
    const deliveryTaxable = deliveryCharge / (1 + deliveryGST / 100);
    const deliveryTax = deliveryCharge - deliveryTaxable;
    
    hsnBreakdown[deliveryHSN] = {
      taxable: deliveryTaxable,
      cgst: deliveryTax / 2,
      sgst: deliveryTax / 2,
      gstRate: deliveryGST
    };
  }
  
  const totalTaxableValue = Object.values(hsnBreakdown).reduce((sum, val) => sum + val.taxable, 0);
  const totalCGST = Object.values(hsnBreakdown).reduce((sum, val) => sum + val.cgst, 0);
  const totalSGST = Object.values(hsnBreakdown).reduce((sum, val) => sum + val.sgst, 0);
  const totalTax = totalCGST + totalSGST;
  
  const grandTotal = subtotal + deliveryCharge;
  const totalQuantity = invoiceData.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const amountInWords = numberToWords(Math.round(grandTotal)) + ' Only';
  const taxAmountInWords = numberToWords(Math.round(totalTax)) + ' Only';
  
  const invoiceDate = new Date(invoiceData.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });
  
  const currentTime = new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>Tax Invoice</Text>
        
        {/* Company Header */}
        <View style={styles.companyHeader}>
          <View style={styles.logoCell}>
            <Image
              src="https://www.vijayagenciesjpr.com/X.JPEG.jpg"
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
          </View>
          
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>Vijay Agencies</Text>
            <Text style={{ fontSize: 8, marginTop: 2 }}>A 917 SIDDARTH NAGAR</Text>
            <Text style={{ fontSize: 8 }}>NEAR JAIN MANDIR JAIPUR</Text>
            <Text style={{ fontSize: 8 }}>PHONE : +91-9315630408, 9414073671</Text>
            <Text style={{ fontSize: 8 }}>Pincode: 302025</Text>
            <Text style={{ fontSize: 8 }}>GSTIN/UIN : 08AAJPV2631B1Z6</Text>
            <Text style={{ fontSize: 8 }}>State Name : Rajasthan, Code : 08</Text>
            <Text style={{ fontSize: 8 }}>CIN : 041</Text>
            <Text style={{ fontSize: 8 }}>E-Mail : vijayagenciesjpr@yahoo.in</Text>
          </View>
          
          <View style={styles.invoiceInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Invoice No.</Text>
              <Text style={styles.infoValue}>{invoiceData.invoiceNo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dated</Text>
              <Text style={styles.infoValue}>{invoiceDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Delivery Note</Text>
              <Text style={styles.infoValue}></Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reference No.</Text>
              <Text style={styles.infoLabel}>Other References</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Buyer&apos;s Order No.</Text>
              <Text style={styles.infoLabel}>Dated</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dispatch Doc No.</Text>
              <Text style={styles.infoLabel}>Delivery Note Date</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dispatched through</Text>
              <Text style={styles.infoLabel}>Destination</Text>
            </View>
          </View>
        </View>
        
        {/* Buyer Details */}
        <View style={[styles.table, { marginTop: 0 }]}>
          <View style={{ padding: 5 }}>
            <Text style={styles.textBold}>Buyer (Bill to)</Text>
            <Text style={[styles.textBold, { marginTop: 2 }]}>{invoiceData.buyer.name}</Text>
            <Text style={{ marginTop: 2, fontSize: 8 }}>{invoiceData.buyer.address}</Text>
            {invoiceData.buyer.gstin && (
              <Text style={{ marginTop: 2, fontSize: 8 }}>GSTIN/UIN : {invoiceData.buyer.gstin}</Text>
            )}
            <Text style={{ marginTop: 2, fontSize: 8 }}>State Name : {invoiceData.buyer.state}, Code : 08</Text>
            <Text style={{ fontSize: 8 }}>Place of Supply : {invoiceData.buyer.state}</Text>
          </View>
        </View>
        
        {/* Items Table */}
        <View style={[styles.table, styles.itemsTable]}>
          {/* Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.headerCell, { width: '5%' }]}>Sl</Text>
            <Text style={[styles.headerCell, { width: '28%' }]}>Description of Goods</Text>
            <Text style={[styles.headerCell, { width: '10%' }]}>HSN/SAC</Text>
            <Text style={[styles.headerCell, { width: '7%' }]}>GST Rate</Text>
            <Text style={[styles.headerCell, { width: '10%' }]}>Quantity</Text>
            <Text style={[styles.headerCell, { width: '10%' }]}>Rate</Text>
            <Text style={[styles.headerCell, { width: '7%' }]}>per</Text>
            <Text style={[styles.headerCell, { width: '8%' }]}>Disc. %</Text>
            <Text style={[styles.headerCell, { width: '15%', borderRightWidth: 0 }]}>Amount</Text>
          </View>
          
          {/* Items */}
          {invoiceData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.textCenter, { width: '5%' }]}>{index + 1}</Text>
              <Text style={[styles.tableCell, { width: '28%' }]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '10%' }]}>{item.hsn || '-'}</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '7%' }]}>{item.gst || 18}%</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '10%' }]}>{item.quantity} Pcs.</Text>
              <Text style={[styles.tableCell, styles.textRight, { width: '10%' }]}>₹{item.rate.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '7%' }]}>Pcs.</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '8%' }]}>-</Text>
              <Text style={[styles.tableCell, styles.textRight, { width: '15%', borderRightWidth: 0 }]}>
                ₹{(item.rate * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          {/* Delivery Charge */}
          {deliveryCharge > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.textCenter, { width: '5%' }]}>{invoiceData.items.length + 1}</Text>
              <Text style={[styles.tableCell, { width: '28%' }]}>Delivery Charges</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '10%' }]}>996819</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '7%' }]}></Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '10%' }]}>1 Pcs.</Text>
              <Text style={[styles.tableCell, styles.textRight, { width: '10%' }]}>₹{deliveryCharge.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '7%' }]}>Pcs.</Text>
              <Text style={[styles.tableCell, styles.textCenter, { width: '8%' }]}>-</Text>
              <Text style={[styles.tableCell, styles.textRight, { width: '15%', borderRightWidth: 0 }]}>
                ₹{deliveryCharge.toFixed(2)}
              </Text>
            </View>
          )}
          
          {/* Total Row */}
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.tableCell, styles.textRight, styles.textBold, { width: '50%' }]}>Total</Text>
            <Text style={[styles.tableCell, styles.textCenter, styles.textBold, { width: '10%' }]}>
              {totalQuantity} Pcs.
            </Text>
            <Text style={[styles.tableCell, { width: '10%' }]}></Text>
            <Text style={[styles.tableCell, { width: '7%' }]}></Text>
            <Text style={[styles.tableCell, { width: '8%' }]}></Text>
            <Text style={[styles.tableCell, styles.textRight, styles.textBold, { width: '15%', borderRightWidth: 0 }]}>
              ₹{grandTotal.toFixed(2)}{'\n'}
              <Text style={{ fontSize: 7 }}>E. & O.E</Text>
            </Text>
          </View>
        </View>
        
        {/* Amount in Words */}
        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <View style={styles.amountLeft}>
              <Text style={styles.textBold}>Amount Chargeable (in words)</Text>
              <Text style={[styles.textBold, { marginTop: 3, fontSize: 10 }]}>INR {amountInWords}</Text>
            </View>
            
            <View style={styles.amountRight}>
              <View style={styles.taxBreakdownTable}>
                <View style={styles.taxRow}>
                  <Text style={[styles.taxCell, styles.textBold]}>HSN/SAC</Text>
                  <Text style={[styles.taxCell, styles.textBold]}>Taxable{'\n'}Value</Text>
                  <Text style={[styles.taxCell, styles.textBold]}>CGST{'\n'}Rate</Text>
                  <Text style={[styles.taxCell, styles.textBold]}>Amount{'\n'}₹</Text>
                  <Text style={[styles.taxCell, styles.textBold]}>SGST{'\n'}Rate</Text>
                  <Text style={[styles.taxCell, styles.textBold]}>Amount{'\n'}₹</Text>
                  <Text style={[styles.taxCell, styles.textBold]}>Total Tax{'\n'}Amount</Text>
                </View>
                
                {Object.entries(hsnBreakdown).map(([hsn, data]) => (
                  <View key={hsn} style={styles.taxRow}>
                    <Text style={styles.taxCell}>{hsn}</Text>
                    <Text style={styles.taxCell}>{data.taxable.toFixed(2)}</Text>
                    <Text style={[styles.taxCell, styles.textCenter]}>{(data.gstRate / 2)}%</Text>
                    <Text style={styles.taxCell}>{data.cgst.toFixed(2)}</Text>
                    <Text style={[styles.taxCell, styles.textCenter]}>{(data.gstRate / 2)}%</Text>
                    <Text style={styles.taxCell}>{data.sgst.toFixed(2)}</Text>
                    <Text style={styles.taxCell}>{(data.cgst + data.sgst).toFixed(2)}</Text>
                  </View>
                ))}
                
                <View style={[styles.taxRow, { borderTopWidth: 1, borderTopColor: '#000', paddingTop: 2 }]}>
                  <Text style={[styles.taxCell, styles.textBold]}>Total</Text>
                  <Text style={[styles.taxCell, styles.textBold]}>{totalTaxableValue.toFixed(2)}</Text>
                  <Text style={styles.taxCell}></Text>
                  <Text style={[styles.taxCell, styles.textBold]}>{totalCGST.toFixed(2)}</Text>
                  <Text style={styles.taxCell}></Text>
                  <Text style={[styles.taxCell, styles.textBold]}>{totalSGST.toFixed(2)}</Text>
                  <Text style={[styles.taxCell, styles.textBold]}>{totalTax.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={{ padding: 5, borderTopWidth: 1, borderTopColor: '#000' }}>
            <Text style={styles.textBold}>Tax Amount (in words) : INR {taxAmountInWords}</Text>
          </View>
        </View>
        
        {/* Bank Details */}
        <View style={styles.bankDetails}>
          <View style={styles.bankRow}>
            <View style={styles.bankLeft}>
              <Text style={styles.textBold}>Company&apos;s VAT TIN</Text>
              <Text style={styles.textBold}>Company&apos;s CST No.</Text>
              <Text style={styles.textBold}>Company&apos;s PAN</Text>
              <Text style={[styles.textBold, { marginTop: 5 }]}>Declaration</Text>
              <Text style={{ fontSize: 7, marginTop: 2 }}>
                We certify that this invoice shows the actual price of the{'\n'}
                goods described and that all particulars are true and correct.
              </Text>
            </View>
            
            <View style={styles.bankRight}>
              <Text>08022201132</Text>
              <Text>08022201132</Text>
              <Text style={styles.textBold}>AAJPV2631B</Text>
              <Text style={[styles.textBold, { marginTop: 5 }]}>Date & Time    {invoiceDate} at {currentTime}</Text>
              <Text style={[styles.textBold, { marginTop: 5 }]}>Company&apos;s Bank Details</Text>
              <Text style={styles.textBold}>A/c Holder&apos;s Name : Vijay Agencies</Text>
              <Text style={styles.textBold}>Bank Name : HDFC U Bank OD 9419</Text>
              <Text style={styles.textBold}>A/c No. : 22215504423694</Text>
              <Text style={styles.textBold}>Branch & IFS Code : GIRDHAK MARG & AUBL0002550</Text>
              <Text style={{ fontSize: 7, marginTop: 10, textAlign: 'right' }}>for Vijay Agencies</Text>
            </View>
          </View>
        </View>
        
        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureLeft}>
              <Text style={styles.textBold}>Customer&apos;s Signature</Text>
            </View>
            <View style={styles.signatureRight}>
              <Text style={styles.textBold}>Authorised Signatory</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.footer}>This is a Computer Generated Invoice</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDFDocument;