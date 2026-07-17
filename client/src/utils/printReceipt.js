export const printThermalReceipt = (receipt, settings = {}) => {
    // Create a hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.bottom = "0";
    iframe.style.right = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
    
    const {
        restaurantName = "Taste Hub",
        address = "G-12, Food Circle Mall, Downtown City Centre, 400001",
        phone = "+91 98765 43210",
        currency = "INR",
        receiptFooter = "Thank you for dining with us!",
        logoUrl = ""
    } = settings;

    const currencySymbol = currency === "INR" || currency === "₹" ? "₹" : (currency || "$");

    const itemsHtml = receipt.items
        .map(
            (item) => `
        <tr>
            <td style="padding: 4px 0; font-family: monospace; font-size: 11px;">
                ${item.name}<br/>
                ${item.quantity} x ${currencySymbol}${Number(item.pricePerQuantity || item.price).toFixed(2)}
            </td>
            <td style="text-align: right; padding: 4px 0; font-family: monospace; font-size: 11px; vertical-align: top;">
                ${currencySymbol}${Number(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `
        )
        .join("");

    const paymentDetailsHtml = receipt.paymentMethod === "Online"
        ? `
        <div style="border-top: 1px dashed #000; padding: 6px 0; font-size: 11px; font-family: monospace;">
            <div>Payment Method: ${receipt.paymentMethod}</div>
            <div style="word-break: break-all; margin-top: 2px;">Razorpay Order ID:<br/>${receipt.paymentData?.razorpay_order_id || "N/A"}</div>
            <div style="word-break: break-all; margin-top: 2px;">Razorpay Payment ID:<br/>${receipt.paymentData?.razorpay_payment_id || "N/A"}</div>
        </div>
        `
        : `
        <div style="border-top: 1px dashed #000; padding: 6px 0; font-size: 11px; font-family: monospace;">
            <div>Payment Method: ${receipt.paymentMethod}</div>
        </div>
        `;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt_${receipt.orderId}</title>
            <style>
                @page {
                    size: 80mm auto;
                    margin: 0;
                }
                body {
                    width: 72mm;
                    margin: 2mm auto;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 12px;
                    line-height: 1.3;
                    color: #000;
                }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .bold { font-weight: bold; }
                .header { margin-bottom: 10px; }
                .header h2 { margin: 0 0 4px 0; font-size: 15px; text-transform: uppercase; }
                .header p { margin: 2px 0; font-size: 11px; }
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 8px;
                    font-size: 11px;
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 8px;
                }
                .items-table th {
                    border-bottom: 1px dashed #000;
                    text-align: left;
                    font-size: 11px;
                    padding: 4px 0;
                }
                .totals {
                    width: 100%;
                    margin-top: 6px;
                    border-top: 1px dashed #000;
                    padding-top: 4px;
                    font-size: 11px;
                }
                .totals td {
                    padding: 2px 0;
                }
                .footer {
                    margin-top: 12px;
                    border-top: 1px dashed #000;
                    padding-top: 6px;
                    font-size: 11px;
                }
            </style>
        </head>
        <body>
            <div class="header text-center">
                ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%; border: 1px dashed #000; margin-bottom: 5px;" /><br/>` : ""}
                <h2>${restaurantName}</h2>
                <p>${address}</p>
                <p>Phone: ${phone}</p>
            </div>
            
            <div style="border-top: 1px dashed #000; padding: 6px 0; font-size: 11px; font-family: monospace;">
                <div>Date: ${new Date().toLocaleString()}</div>
                <div>Order Ref: ${receipt.orderId}</div>
                <div>Table: ${receipt.tableNumber || "Takeaway"}</div>
                <div>Customer: ${receipt.customerName}</div>
                ${receipt.customerPhone ? `<div>Phone: ${receipt.customerPhone}</div>` : ""}
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th style="font-family: monospace;">ITEM</th>
                        <th style="text-align: right; font-family: monospace;">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <table class="totals">
                <tr>
                    <td style="font-family: monospace;">Subtotal:</td>
                    <td class="text-right" style="font-family: monospace;">${currencySymbol}${Number(receipt.subtotal).toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="font-family: monospace;">Tax (${receipt.taxPercent}%):</td>
                    <td class="text-right" style="font-family: monospace;">${currencySymbol}${Number(receipt.taxAmount).toFixed(2)}</td>
                </tr>
                <tr class="bold" style="font-size: 12px;">
                    <td style="font-family: monospace;">Grand Total:</td>
                    <td class="text-right" style="font-family: monospace;">${currencySymbol}${Number(receipt.total).toFixed(2)}</td>
                </tr>
            </table>

            ${paymentDetailsHtml}

            <div class="footer text-center">
                <p>${receiptFooter}</p>
                <p style="font-size: 9px; margin-top: 4px; color: #555;">Thank you for your visit!</p>
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
