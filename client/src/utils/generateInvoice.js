export const generateInvoicePDF = ({
    restaurantName = "Taste Hub",
    orderId = "N/A",
    customerName = "Walk-in Customer",
    customerPhone = "",
    tableNumber = "Takeaway",
    date = new Date().toLocaleString(),
    items = [],
    subtotal = 0,
    taxPercent = 18,
    taxAmount = 0,
    total = 0,
    paymentMethod = "Cash",
    paymentData = null,

    serviceCharge = 0,
    roundOff = 0,
    logoUrl = "",
    upiId = "",
    upiName = ""
}) => {
    // Create a hidden iframe for A4 printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.bottom = "0";
    iframe.style.right = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;

    // Define currency symbol
    const currencySymbol = "₹";

    // Format item rows
    const itemsHtml = items
        .map(
            (item, index) => `
        <tr class="item-row">
            <td class="text-center font-medium text-gray-500">${index + 1}</td>
            <td>
                <div class="font-bold text-gray-800">${item.name}</div>
                <div class="text-[10px] text-gray-400">Freshly prepared dish</div>
            </td>
            <td class="text-center font-medium">${item.quantity}</td>
            <td class="text-right font-medium">${currencySymbol}${Number(item.pricePerQuantity || item.price).toFixed(2)}</td>
            <td class="text-right text-gray-400 font-medium">${taxPercent}%</td>
            <td class="text-right font-bold text-gray-800">${currencySymbol}${Number(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `
        )
        .join("");

    // Dynamic payment status styling
    const statusText = "Paid";
    const statusColorClass = "status-paid";

    const paymentDetailsHtml = paymentMethod === "Online"
        ? `
        <div class="payment-info-card">
            <div class="card-title font-semibold mb-2">Payment Details</div>
            <div class="info-row">
                <span>Method:</span>
                <span class="font-medium text-gray-800">${paymentMethod}</span>
            </div>
            <div class="info-row mt-1">
                <span>Razorpay Order:</span>
                <span class="font-mono text-[10px] text-gray-600 break-all text-right max-w-[150px]">${paymentData?.razorpay_order_id || "N/A"}</span>
            </div>
            <div class="info-row mt-1">
                <span>Razorpay Payment:</span>
                <span class="font-mono text-[10px] text-gray-600 break-all text-right max-w-[150px]">${paymentData?.razorpay_payment_id || "N/A"}</span>
            </div>
        </div>
        `
        : `
        <div class="payment-info-card">
            <div class="card-title font-semibold mb-2">Payment Details</div>
            <div class="info-row">
                <span>Method:</span>
                <span class="font-medium text-gray-800">${paymentMethod}</span>
            </div>
            <div class="info-row mt-1">
                <span>Status:</span>
                <span class="font-medium text-gray-800">Cash Received</span>
            </div>
        </div>
        `;

    // Static/Dynamic UPI QR Code Generator - always dynamic with pre-filled amount
    const payeeName = upiName || restaurantName;
    const upiLink = `upi://pay?pa=${upiId || "tastehub@upi"}&pn=${encodeURIComponent(payeeName)}&am=${total.toFixed(2)}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice_${orderId.replace("#", "")}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
            <style>
                @page {
                    size: A4;
                    margin: 12mm 12mm 12mm 12mm;
                }
                * {
                    box-sizing: border-box;
                }
                body {
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    font-size: 11px;
                    line-height: 1.4;
                    color: #1F2937;
                    background-color: #FFFFFF;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                h1, h2, h3, h4 {
                    font-family: 'Poppins', sans-serif;
                    margin: 0;
                }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .font-bold { font-weight: 700; }
                .font-semibold { font-weight: 600; }
                .font-medium { font-weight: 500; }
                
                /* Layout Grids */
                .header-container {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 20px;
                    margin-bottom: 25px;
                    align-items: start;
                }
                .restaurant-info {
                    padding-right: 20px;
                }
                .restaurant-name {
                    font-size: 26px;
                    font-weight: 700;
                    color: #1F2937;
                    letter-spacing: -0.5px;
                    margin-bottom: 2px;
                }
                .tagline {
                    font-size: 10px;
                    color: #F59E0B;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                }
                .address-details {
                    color: #6B7280;
                    font-size: 10.5px;
                    line-height: 1.5;
                }
                .invoice-card {
                    background-color: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 16px;
                }
                .invoice-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1F2937;
                    text-align: right;
                    letter-spacing: -0.5px;
                    margin-bottom: 10px;
                }
                
                /* Icon lists */
                .meta-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 6px;
                    color: #6B7280;
                    font-size: 10px;
                }
                .meta-label {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .meta-value {
                    font-weight: 600;
                    color: #1F2937;
                }
                .meta-icon {
                    width: 12px;
                    height: 12px;
                    fill: #6B7280;
                }

                /* Customer Details bordered card */
                .customer-card {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    background-color: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 25px;
                }
                .customer-col {
                    display: flex;
                    flex-direction: column;
                }
                .customer-label {
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #6B7280;
                    margin-bottom: 4px;
                }
                .customer-value {
                    font-size: 11.5px;
                    font-weight: 600;
                    color: #1F2937;
                }

                /* Status badges */
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 3px 8px;
                    border-radius: 9999px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    width: fit-content;
                }
                .status-paid {
                    background-color: rgba(22, 163, 74, 0.1);
                    color: #16A34A;
                    border: 1px solid rgba(22, 163, 74, 0.2);
                }

                /* Table Styling */
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 25px;
                }
                .items-table th {
                    background-color: #F9FAFB;
                    border-bottom: 2px solid #E5E7EB;
                    padding: 10px 12px;
                    font-size: 10.5px;
                    font-weight: 600;
                    color: #1F2937;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .items-table td {
                    padding: 12px;
                    border-bottom: 1px solid #E5E7EB;
                    vertical-align: middle;
                }
                .item-row:nth-child(even) {
                    background-color: #F9FAFB/50;
                }
                .item-row:hover {
                    background-color: #F3F4F6;
                }
                
                /* Footer layout */
                .bottom-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-top: 10px;
                    align-items: start;
                }
                .left-column {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .right-column {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                /* Totals card right aligned */
                .totals-card {
                    background-color: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 16px;
                    width: 100%;
                    max-width: 320px;
                }
                .totals-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                    font-size: 11px;
                    color: #6B7280;
                }
                .totals-divider {
                    border-top: 1px solid #E5E7EB;
                    margin: 8px 0;
                }
                .grand-total-row {
                    display: flex;
                    justify-content: space-between;
                    background-color: #1F2937;
                    border-radius: 8px;
                    padding: 10px 12px;
                    margin-top: 6px;
                    color: #FFFFFF;
                }
                .grand-total-label {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .grand-total-val {
                    font-size: 18px;
                    font-weight: 700;
                    color: #F59E0B;
                }

                /* Payment Information */
                .payment-info-card {
                    background-color: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 15px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10.5px;
                    color: #6B7280;
                }
                .card-title {
                    font-size: 11.5px;
                    color: #1F2937;
                    border-bottom: 1px solid #E5E7EB;
                    padding-bottom: 6px;
                }

                /* QR Section */
                .qr-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background-color: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 12px;
                }
                .qr-img {
                    width: 70px;
                    height: 70px;
                    border: 1px solid #E5E7EB;
                    border-radius: 6px;
                }
                .qr-details {
                    display: flex;
                    flex-direction: column;
                }
                .qr-title {
                    font-weight: 600;
                    color: #1F2937;
                    font-size: 11px;
                }
                .qr-desc {
                    color: #6B7280;
                    font-size: 9.5px;
                    margin-top: 2px;
                    margin-bottom: 4px;
                }
                .qr-id {
                    font-family: monospace;
                    font-size: 9px;
                    background-color: #F3F4F6;
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: #1F2937;
                    width: fit-content;
                }

                /* Policy/Footer */
                .invoice-footer {
                    margin-top: 40px;
                    border-top: 1px solid #E5E7EB;
                    padding-top: 15px;
                    text-align: center;
                    color: #6B7280;
                    font-size: 9.5px;
                }
                .footer-links {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 6px;
                    font-weight: 500;
                }
                .footer-links a {
                    color: #6B7280;
                    text-decoration: none;
                }
                .footer-links a:hover {
                    color: #1F2937;
                }
            </style>
        </head>
        <body>
            <!-- 1. Header (Branding & Logo) -->
            <div class="header-container">
                <div class="restaurant-info">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 2px;">
                        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="width: 32px; height: 32px; object-fit: cover; border-radius: 8px; border: 1px solid #E5E7EB;" />` : ""}
                        <div class="restaurant-name">${restaurantName}</div>
                    </div>
                    <div class="tagline">Premium Dining Experience</div>
                    <div class="address-details">
                        G-12, Food Circle Mall, Downtown City Centre, 400001<br/>
                        Phone: +91 98765 43210 &nbsp;|&nbsp; Email: contact@tastehub.com<br/>
                        GSTIN: 27AAAAA1111A1Z1 &nbsp;|&nbsp; FSSAI License: 10023022000214
                    </div>
                </div>
                <div class="invoice-card">
                    <div class="invoice-title">INVOICE</div>
                    <div class="meta-row">
                        <div class="meta-label">
                            <!-- Invoice Icon -->
                            <svg class="meta-icon" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                            Invoice ID:
                        </div>
                        <div class="meta-value">${orderId}</div>
                    </div>
                    <div class="meta-row">
                        <div class="meta-label">
                            <!-- Calendar Icon -->
                            <svg class="meta-icon" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                            Date & Time:
                        </div>
                        <div class="meta-value">${date}</div>
                    </div>
                    <div class="meta-row">
                        <div class="meta-label">
                            <!-- Table Icon -->
                            <svg class="meta-icon" viewBox="0 0 24 24"><path d="M4 18v3h3v-3h10v3h3v-3h1v-6H3v6h1zM3 3v2h18V3H3zm2 3h14v4H5V6z"/></svg>
                            Table No:
                        </div>
                        <div class="meta-value">${tableNumber}</div>
                    </div>
                    <div class="meta-row" style="margin-bottom: 0;">
                        <div class="meta-label">
                            <!-- Customer Icon -->
                            <svg class="meta-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                            Cashier:
                        </div>
                        <div class="meta-value">Admin POS</div>
                    </div>
                </div>
            </div>

            <!-- 2. Customer Section -->
            <div class="customer-card">
                <div class="customer-col">
                    <div class="customer-label">Customer Details</div>
                    <div class="customer-value">${customerName}</div>
                    <div class="text-gray-400 text-[10px] mt-0.5">${customerPhone || "Walk-in Guest"}</div>
                </div>
                <div class="customer-col">
                    <div class="customer-label">Service Type & Guests</div>
                    <div class="customer-value">${tableNumber && tableNumber !== "Takeaway" ? "Dine In" : "Takeaway"}</div>
                    <div class="text-gray-400 text-[10px] mt-0.5">${tableNumber && tableNumber !== "Takeaway" ? "Table Session Order" : "Direct Counter Order"}</div>
                </div>
                <div class="customer-col" style="align-items: flex-end;">
                    <div class="customer-label">Invoice Status</div>
                    <div class="status-badge ${statusColorClass}">
                        <svg class="w-2 h-2 fill-current" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg>
                        ${statusText}
                    </div>
                    <div class="text-[9px] text-gray-400 mt-1">Paid via ${paymentMethod}</div>
                </div>
            </div>

            <!-- 3. Items Table -->
            <table class="items-table">
                <thead>
                    <tr>
                        <th class="text-center" style="width: 5%;">#</th>
                        <th class="text-left" style="width: 55%;">Item Description</th>
                        <th class="text-center" style="width: 10%;">Qty</th>
                        <th class="text-right" style="width: 12%;">Unit Price</th>
                        <th class="text-right" style="width: 8%;">Tax</th>
                        <th class="text-right" style="width: 12%;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <!-- 4. Bottom Grid (Payment + QR + Totals Summary) -->
            <div class="bottom-section">
                <div class="left-column">
                    ${paymentDetailsHtml}
                    
                    <div class="qr-card">
                        <img class="qr-img" src="${qrCodeUrl}" alt="Scan to Pay" />
                        <div class="qr-details">
                            <span class="qr-title">Scan to Pay Digitally</span>
                            <span class="qr-desc">Scan via BHIM UPI, GPay, PhonePe or Paytm to settle this bill directly.</span>
                            <span class="qr-id">UPI ID: ${upiId || "tastehub@upi"}</span>
                        </div>
                    </div>
                </div>

                <div class="right-column">
                    <div class="totals-card">
                        <div class="totals-row">
                            <span>Subtotal:</span>
                            <span class="font-semibold text-gray-800">${currencySymbol}${Number(subtotal).toFixed(2)}</span>
                        </div>

                        <div class="totals-row">
                            <span>Tax (GST ${taxPercent}%):</span>
                            <span class="font-semibold text-gray-800">${currencySymbol}${Number(taxAmount).toFixed(2)}</span>
                        </div>
                        ${Number(serviceCharge) > 0 ? `
                        <div class="totals-row">
                            <span>Service Charge:</span>
                            <span class="font-semibold text-gray-800">${currencySymbol}${Number(serviceCharge).toFixed(2)}</span>
                        </div>
                        ` : ""}
                        <div class="totals-row">
                            <span>Round Off:</span>
                            <span class="font-semibold text-gray-800">${currencySymbol}${Number(roundOff).toFixed(2)}</span>
                        </div>
                        <div class="totals-divider"></div>
                        <div class="grand-total-row">
                            <span class="grand-total-label">GRAND TOTAL</span>
                            <span class="grand-total-val">${currencySymbol}${Number(total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 5. Footer -->
            <div class="invoice-footer">
                <div class="font-semibold text-gray-800" style="font-size: 11px; margin-bottom: 2px;">Thank you for dining with us!</div>
                <div>Please Visit Again! We hope you enjoyed your meal and experience.</div>
                
                <div class="footer-links">
                    <a href="#">www.tastehub.com</a>
                    <span>•</span>
                    <a href="#">Instagram: @tastehub_restaurant</a>
                    <span>•</span>
                    <a href="#">Refund Policy</a>
                    <span>•</span>
                    <a href="#">Terms & Conditions</a>
                </div>
                <div style="margin-top: 10px; font-size: 8.5px; color: #9CA3AF;">
                    FSSAI License No: 10023022000214 &nbsp;|&nbsp; Powered by RestroDesk POS Platform
                </div>
            </div>
        </body>
        </html>
    `;

    // Write content and print
    doc.document.open();
    doc.document.write(htmlContent);
    doc.document.close();

    // Trigger printing once iframe is fully loaded
    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        // Remove iframe after printing dialog closes
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    }, 500);
};
