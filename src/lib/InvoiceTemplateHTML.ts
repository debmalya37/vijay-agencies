// lib/InvoiceTemplateHTML.ts
export function generateInvoiceHTML(order: any) {
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
              <div style="font-size: 24px; font-weight: bold; color: #8B0000;">VA</div>
              <div style="font-size: 8px; margin-top: -5px;">LOGO</div>
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
                <tr><td class="no-border"><strong>Invoice No.</strong></td><td class="no-border">${order.invoiceNo || 'VA/25-26/4383'}</td></tr>
                <tr><td class="no-border"><strong>Dated</strong></td><td class="no-border">${order.date || '18-Sep-25'}</td></tr>
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
              <strong>${order.buyer?.name || 'Vimal Vittas'}</strong><br/>
              ${order.buyer?.address || 'Plot No 2 Prahlad Colony<br/>Sanganer Jaipur<br/>GSTIN/UIN : 08AAAPV2631B1ZCS<br/>State Name : Rajasthan, Code : 08<br/>Place of Supply : Rajasthan'}
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
            ${order.items?.map((item: any, index: number) => `
              <tr>
                <td class="center">${index + 1}</td>
                <td>${item.description || 'Wet Wipe Tissue'}<br/>
                    <span style="font-size: 9px; color: #666;">${item.subDescription || '350ml with Dorn Lid'}</span>
                </td>
                <td class="center">${item.hsn || '48182000'}</td>
                <td class="center">${item.gstRate || '18'} %</td>
                <td class="center">${item.quantity || '6,000'} ${item.unit || 'Pcs.'}</td>
                <td class="right">${item.rate?.toFixed(2) || '1.40'} ${item.unit || 'Pcs.'}</td>
                <td class="center">${item.unit || 'Pcs.'}</td>
                <td class="center">${item.discount || ''}</td>
                <td class="right">${item.amount?.toFixed(2) || '8,400.00'}</td>
              </tr>
            `).join('')}
            ${order.items?.length > 1 ? order.items.slice(1).map((item: any, index: number) => `
              <tr>
                <td class="center">${index + 2}</td>
                <td>${item.description}<br/>
                    <span style="font-size: 9px; color: #666;">${item.subDescription || ''}</span>
                </td>
                <td class="center">${item.hsn}</td>
                <td class="center">${item.gstRate} %</td>
                <td class="center">${item.quantity} ${item.unit}</td>
                <td class="right">${item.rate?.toFixed(2)} ${item.unit}</td>
                <td class="center">${item.unit}</td>
                <td class="center">${item.discount || ''}</td>
                <td class="right">${item.amount?.toFixed(2)}</td>
              </tr>
            `).join('') : ''}
            <!-- Empty rows for spacing -->
            ${Array(8).fill(0).map(() => `
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
              <td class="center"><strong>${order.totals?.totalQuantity || '6,500 Pcs.'}</strong></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="right"><strong>₹ ${order.totals?.subtotal?.toFixed(2) || '12,862.00'}</strong><br/>
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
              <span class="amount-words">INR ${order.totals?.amountInWords || 'Twelve Thousand Eight Hundred Sixty Two Only'}</span>
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
                <tr>
                  <td class="no-border">48182000</td>
                  <td class="no-border right">8,400.00</td>
                  <td class="no-border center">9%</td>
                  <td class="no-border right">756.00</td>
                  <td class="no-border center">9%</td>
                  <td class="no-border right">756.00</td>
                  <td class="no-border right">1,512.00</td>
                </tr>
                <tr>
                  <td class="no-border">48236000</td>
                  <td class="no-border right">2,500.00</td>
                  <td class="no-border center">9%</td>
                  <td class="no-border right">225.00</td>
                  <td class="no-border center">9%</td>
                  <td class="no-border right">225.00</td>
                  <td class="no-border right">450.00</td>
                </tr>
                <tr style="border-top: 1px solid black;">
                  <td class="no-border"><strong>Total</strong></td>
                  <td class="no-border right"><strong>10,900.00</strong></td>
                  <td class="no-border"></td>
                  <td class="no-border right"><strong>981.00</strong></td>
                  <td class="no-border"></td>
                  <td class="no-border right"><strong>981.00</strong></td>
                  <td class="no-border right"><strong>1,962.00</strong></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Tax Amount in Words -->
        <table style="margin-top: 0;">
          <tr>
            <td>
              <strong>Tax Amount (in words) : INR ${order.totals?.taxAmountInWords || 'One Thousand Nine Hundred Sixty Two Only'}</strong>
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
              <strong>Date & Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 18-Sep-25 at 12:58</strong><br/><br/>
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