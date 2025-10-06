// lib/InvoiceTemplateHTML.ts

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

export function generateInvoiceHTML(order: any) {
  // Calculate subtotal from items
  const subtotal = order.items.reduce((sum: number, item: any) => {
    return sum + (item.rate * item.quantity);
  }, 0);
  
  // Delivery charge logic: ₹150 if subtotal < ₹50,000, else ₹0
  const deliveryCharge = subtotal < 50000 ? 150 : 0;
  
  // Calculate tax breakdown by HSN
  const hsnBreakdown: { [key: string]: { taxable: number, cgst: number, sgst: number, gstRate: number } } = {};
  
  // Process order items
  order.items.forEach((item: any) => {
    const hsn = item.hsn || '00000000';
    const gstRate = item.gst || 18;
    const itemTotal = item.rate * item.quantity;
    
    // Calculate taxable value (reverse calculation from price including GST)
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
  
  // Add delivery charge to HSN breakdown if applicable
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
  
  // Total quantity
  const totalQuantity = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  
  // Convert amounts to words
  const amountInWords = numberToWords(Math.round(grandTotal)) + ' Only';
  const taxAmountInWords = numberToWords(Math.round(totalTax)) + ' Only';
  
  // Format date
  const invoiceDate = new Date(order.date || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });
  
  const currentTime = new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
  
  return `
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11px; 
            margin: 0; 
            padding: 10px;
            line-height: 1.2;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 0;
          }
          th, td { 
            border: 1px solid black; 
            padding: 3px 4px; 
            vertical-align: top; 
            font-size: 10px;
          }
          .center { text-align: center; }
          .right { text-align: right; }
          .left { text-align: left; }
          .bold { font-weight: bold; }
          .no-border { border: none; }
          .no-border td { border: none; }
          .small { font-size: 9px; }
          .header-title { 
            font-size: 16px; 
            font-weight: bold; 
            text-align: center; 
            margin-bottom: 10px;
            text-decoration: underline;
          }
          .company-name { 
            font-size: 14px; 
            font-weight: bold; 
          }
          .logo-cell {
            width: 80px;
            text-align: center;
            vertical-align: middle;
            border-right: 2px solid black;
          }
          .company-details {
            padding-left: 10px;
          }
          .invoice-info-table {
            margin-top: 0;
          }
          .invoice-info-table td {
            padding: 2px 4px;
            font-size: 10px;
          }
          .items-table th {
            font-size: 9px;
            font-weight: bold;
            text-align: center;
            background-color: #f5f5f5;
            padding: 4px 2px;
          }
          .items-table td {
            font-size: 10px;
            padding: 3px 4px;
          }
          .totals-section {
            margin-top: 5px;
          }
          .tax-breakdown {
            font-size: 10px;
          }
          .amount-words {
            font-weight: bold;
            font-size: 11px;
          }
          .signature-section {
            margin-top: 20px;
          }
          .footer-text {
            font-size: 9px;
            text-align: center;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header-title">Tax Invoice</div>
  
        <!-- Company Header with Logo -->
        <table style="margin-bottom: 0;">
          <tr>
            <td class="logo-cell">
  <img src="https://www.vijayagenciesjpr.com/X.JPEG.jpg" 
       alt="Vijay Agencies Logo" 
       style="max-width: 70px; max-height: 70px; border-radius: 50%;" />
</td>

            <td class="company-details">
              <div class="company-name">Vijay Agencies</div>
              <div style="font-size: 10px; margin-top: 2px;">
                A 917 SIDDARTH NAGAR<br/>
                NEAR JAIN MANDIR JAIPUR<br/>
                PHONE : +91-9315630408, 9414073671<br/>
                Pincode: 302025<br/>
                GSTIN/UIN : 08AAJPV2631B1Z6<br/>
                State Name : Rajasthan, Code : 08<br/>
                CIN : 041<br/>
                E-Mail : vijayagenciesjpr@yahoo.in
              </div>
            </td>
            <td style="width: 200px; vertical-align: top;">
              <table class="invoice-info-table" style="border: none; width: 100%;">
                <tr><td class="no-border"><strong>Invoice No.</strong></td><td class="no-border">${order.invoiceNo}</td></tr>
                <tr><td class="no-border"><strong>Dated</strong></td><td class="no-border">${invoiceDate}</td></tr>
                <tr><td class="no-border"><strong>Delivery Note</strong></td><td class="no-border"></td></tr>
                <tr><td class="no-border"><strong>Reference No. & Date.</strong></td><td class="no-border"><strong>Other References</strong></td></tr>
                <tr><td class="no-border"><strong>Buyer's Order No.</strong></td><td class="no-border"><strong>Dated</strong></td></tr>
                <tr><td class="no-border"><strong>Dispatch Doc No.</strong></td><td class="no-border"><strong>Delivery Note Date</strong></td></tr>
                <tr><td class="no-border"><strong>Dispatched through</strong></td><td class="no-border"><strong>Destination</strong></td></tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Buyer Details -->
        <table style="margin-top: 0;">
          <tr>
            <td>
              <strong>Buyer (Bill to)</strong><br/>
              <strong>${order.buyer.name}</strong><br/>
              ${order.buyer.address}<br/>
              ${order.buyer.gstin ? `GSTIN/UIN : ${order.buyer.gstin}<br/>` : ''}
              State Name : ${order.buyer.state}, Code : 08<br/>
              Place of Supply : ${order.buyer.state}
            </td>
          </tr>
        </table>

        <!-- Items Table -->
        <table class="items-table" style="margin-top: 0;">
          <thead>
            <tr>
              <th style="width: 30px;">Sl</th>
              <th>Description of Goods</th>
              <th style="width: 80px;">HSN/SAC</th>
              <th style="width: 50px;">GST<br/>Rate</th>
              <th style="width: 60px;">Quantity</th>
              <th style="width: 50px;">Rate</th>
              <th style="width: 40px;">per</th>
              <th style="width: 50px;">Disc. %</th>
              <th style="width: 80px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item: any, index: number) => `
              <tr>
                <td class="center">${index + 1}</td>
                <td>${item.description}</td>
                <td class="center">${item.hsn || '-'}</td>
                <td class="center">${item.gst || 18}%</td>
                <td class="center">${item.quantity.toLocaleString('en-IN')} Pcs.</td>
                <td class="right">₹${item.rate.toFixed(2)}</td>
                <td class="center">Pcs.</td>
                <td class="center">-</td>
                <td class="right">₹${(item.rate * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
            ${deliveryCharge > 0 ? `
              <tr>
                <td class="center">${order.items.length + 1}</td>
                <td>Delivery Charges</td>
                <td class="center">996819</td>
                <td class="center"></td>
                <td class="center">1 Pcs.</td>
                <td class="right">₹${deliveryCharge.toFixed(2)}</td>
                <td class="center">Pcs.</td>
                <td class="center">-</td>
                <td class="right">₹${deliveryCharge.toFixed(2)}</td>
              </tr>
            ` : ''}
            <!-- Empty rows for spacing -->
            ${Array(Math.max(0, 8 - order.items.length - (deliveryCharge > 0 ? 1 : 0))).fill(0).map(() => `
              <tr>
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="4" class="right"><strong>Total</strong></td>
              <td class="center"><strong>${totalQuantity.toLocaleString('en-IN')} Pcs.</strong></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="right"><strong>₹${grandTotal.toFixed(2)}</strong><br/>
                  <span style="font-size: 9px;">E. & O.E</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Amount in Words -->
        <table style="margin-top: 0;">
          <tr>
            <td style="width: 70%;">
              <strong>Amount Chargeable (in words)</strong><br/>
              <span class="amount-words">INR ${amountInWords}</span>
            </td>
            <td style="width: 30%;">
              <table class="tax-breakdown" style="border: none; width: 100%;">
                <tr>
                  <td class="no-border"><strong>HSN/SAC</strong></td>
                  <td class="no-border center"><strong>Taxable<br/>Value</strong></td>
                  <td class="no-border center"><strong>CGST<br/>Rate</strong></td>
                  <td class="no-border center"><strong>Amount<br/>₹</strong></td>
                  <td class="no-border center"><strong>SGST/UTGST<br/>Rate</strong></td>
                  <td class="no-border center"><strong>Amount<br/>₹</strong></td>
                  <td class="no-border center"><strong>Total<br/>Tax Amount</strong></td>
                </tr>
                ${Object.entries(hsnBreakdown).map(([hsn, data]) => `
                  <tr>
                    <td class="no-border">${hsn}</td>
                    <td class="no-border right">${data.taxable.toFixed(2)}</td>
                    <td class="no-border center">${(data.gstRate / 2)}%</td>
                    <td class="no-border right">${data.cgst.toFixed(2)}</td>
                    <td class="no-border center">${(data.gstRate / 2)}%</td>
                    <td class="no-border right">${data.sgst.toFixed(2)}</td>
                    <td class="no-border right">${(data.cgst + data.sgst).toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr style="border-top: 1px solid black;">
                  <td class="no-border"><strong>Total</strong></td>
                  <td class="no-border right"><strong>${totalTaxableValue.toFixed(2)}</strong></td>
                  <td class="no-border"></td>
                  <td class="no-border right"><strong>${totalCGST.toFixed(2)}</strong></td>
                  <td class="no-border"></td>
                  <td class="no-border right"><strong>${totalSGST.toFixed(2)}</strong></td>
                  <td class="no-border right"><strong>${totalTax.toFixed(2)}</strong></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Tax Amount in Words -->
        <table style="margin-top: 0;">
          <tr>
            <td>
              <strong>Tax Amount (in words) : INR ${taxAmountInWords}</strong>
            </td>
          </tr>
        </table>

        <!-- Company Details and Bank Info -->
        <table style="margin-top: 5px;">
          <tr>
            <td style="width: 50%;">
              <strong>Company's VAT TIN</strong><br/>
              <strong>Company's CST No.</strong><br/>
              <strong>Company's PAN</strong><br/><br/>
              <strong>Declaration</strong><br/>
              <span style="font-size: 9px;">
              We certify that this invoice shows the actual price of the<br/>
              goods described and that all particulars are true and correct.
              </span>
            </td>
            <td style="width: 50%;">
              08022201132<br/>
              08022201132<br/>
              <strong>AAJPV2631B</strong><br/><br/>
              <strong>Date & Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${invoiceDate} at ${currentTime}</strong><br/><br/>
              <strong>Company's Bank Details</strong><br/>
              <strong>A/c Holder's Name &nbsp;&nbsp; : Vijay Agencies</strong><br/>
              <strong>Bank Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : HDFC U Bank OD 9419</strong><br/>
              <strong>A/c No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : 22215504423694</strong><br/>
              <strong>Branch & IFS Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : GIRDHAK MARG & AUBL0002550</strong><br/>
              <span style="font-size: 9px; margin-left: 200px;">for Vijay Agencies</span>
            </td>
          </tr>
        </table>

        <!-- Customer Signature -->
        <table style="margin-top: 10px;">
          <tr>
            <td style="width: 50%;">
              <strong>Customer's Signature</strong>
            </td>
            <td style="width: 50%; text-align: right;">
              <strong>Authorised Signatory</strong>
            </td>
          </tr>
        </table>

        <div class="footer-text">
          <strong>This is a Computer Generated Invoice</strong>
        </div>
      </body>
    </html>
  `;
}