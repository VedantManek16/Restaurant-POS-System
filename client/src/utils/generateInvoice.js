import { jsPDF } from "jspdf";

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
    paymentMethod = "Cash"
}) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4" // 210mm x 297mm
    });

    // Color palette
    const primaryColor = [246, 177, 0];   // #f6b100 RestroDesk Yellow
    const secondaryColor = [30, 30, 30];  // Dark Charcoal
    const textColor = [60, 60, 60];      // Muted text
    const lightGray = [240, 240, 240];

    // Document styling
    doc.setFont("helvetica");

    // 1. Header (Branding & Logo)
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 0, 210, 45, "F");

    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(restaurantName.toUpperCase(), 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("Premium Dining Experience", 14, 32);

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("INVOICE", 155, 25);

    // 2. Invoice Meta Details (Table, Order ID, Date)
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 14, 58);
    doc.setFont("helvetica", "normal");
    doc.text(`Customer: ${customerName}`, 14, 64);
    if (customerPhone) {
        doc.text(`Phone: ${customerPhone}`, 14, 70);
    }

    doc.setFont("helvetica", "bold");
    doc.text("INVOICE DETAILS:", 130, 58);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${orderId}`, 130, 64);
    doc.text(`Table No: ${tableNumber}`, 130, 70);
    doc.text(`Date: ${date}`, 130, 76);

    // Divider Line
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 84, 196, 84);

    // 3. Items Table Header
    let y = 92;
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(14, y, 182, 8, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("ITEM DESCRIPTION", 18, y + 5.5);
    doc.text("QTY", 110, y + 5.5, { align: "center" });
    doc.text("PRICE", 140, y + 5.5, { align: "right" });
    doc.text("TOTAL", 185, y + 5.5, { align: "right" });

    // 4. Table Rows (Items)
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    items.forEach((item, index) => {
        // Alternating row background for premium readability
        if (index % 2 === 1) {
            doc.setFillColor(250, 250, 250);
            doc.rect(14, y, 182, 8, "F");
        }

        // Truncate long item names to fit
        const truncatedName = item.name.length > 35 ? item.name.substring(0, 32) + "..." : item.name;
        doc.text(truncatedName, 18, y + 5.5);
        doc.text(item.quantity.toString(), 110, y + 5.5, { align: "center" });
        doc.text(`INR ${item.price.toFixed(2)}`, 140, y + 5.5, { align: "right" });
        doc.text(`INR ${(item.price * item.quantity).toFixed(2)}`, 185, y + 5.5, { align: "right" });

        y += 8;
    });

    // 5. Total Calculations Box
    y += 4;
    doc.setDrawColor(220, 220, 220);
    doc.line(14, y, 196, y);

    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Subtotal:", 135, y);
    doc.setTextColor(50, 50, 50);
    doc.text(`INR ${subtotal.toFixed(2)}`, 185, y, { align: "right" });

    y += 6;
    doc.setTextColor(100, 100, 100);
    doc.text(`GST (${taxPercent}%):`, 135, y);
    doc.setTextColor(50, 50, 50);
    doc.text(`INR ${taxAmount.toFixed(2)}`, 185, y, { align: "right" });

    y += 6;
    doc.setDrawColor(220, 220, 220);
    doc.line(130, y, 196, y);

    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("Grand Total:", 135, y);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`INR ${total.toFixed(2)}`, 185, y, { align: "right" });

    // 6. Payment Status badge
    y += 10;
    doc.setFillColor(235, 245, 235); // light pastel green
    doc.rect(14, y - 5, 60, 14, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 100, 40);
    doc.text(`PAYMENT STATUS: PAID`, 18, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Method: ${paymentMethod}`, 18, y + 5);

    // 7. Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(140, 140, 140);
    doc.text("Thank you for dining with us! Please visit again.", 105, 275, { align: "center" });

    // Save PDF
    doc.save(`invoice_${orderId.replace("#", "")}.pdf`);
};
