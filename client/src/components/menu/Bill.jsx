import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { removeCustomerDetails } from "../../redux/slices/customerSlice";

const Bill = () => {
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const customerData = useSelector((state) => state.customer);

    // Calculations
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.0525; // 5.25%
    const taxAmount = subtotal * taxRate;
    const totalWithTax = subtotal + taxAmount;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handlePlaceOrder = () => {
        if (cartItems.length === 0) return;
        if (!paymentMethod) {
            alert("Please select a payment method (Cash or Online) before placing the order.");
            return;
        }

        const customerName = customerData?.customerName || "Walk-in Customer";
        const tableNumber = customerData?.tableNumber || "Takeaway";
        const orderId = customerData?.orderId || "N/A";

        alert(
            `🎉 Order Placed Successfully!\n\n` +
            `Order ID: ${orderId}\n` +
            `Customer: ${customerName}\n` +
            `Table: ${tableNumber}\n` +
            `Items Count: ${totalItems}\n` +
            `Total Bill: ₹${totalWithTax.toFixed(2)} (${paymentMethod})\n\n` +
            `Resetting session for next customer...`
        );

        // Reset POS session
        dispatch(clearCart());
        dispatch(removeCustomerDetails());
        setPaymentMethod(null);
    };

    const handlePrintReceipt = () => {
        if (cartItems.length === 0) return;

        const itemsList = cartItems
            .map(item => `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}${item.notes ? ` [Note: ${item.notes}]` : ""}`)
            .join('\n');

        const customerName = customerData?.customerName || "Walk-in Customer";
        const tableNumber = customerData?.tableNumber || "Takeaway";
        const orderId = customerData?.orderId || "N/A";

        alert(
            `====================================\n` +
            `            RECEIPT SUMMARY         \n` +
            `====================================\n` +
            `Order ID   : ${orderId}\n` +
            `Customer   : ${customerName}\n` +
            `Table      : ${tableNumber}\n` +
            `Date       : ${new Date().toLocaleString()}\n` +
            `------------------------------------\n` +
            `${itemsList}\n` +
            `------------------------------------\n` +
            `Subtotal   : ₹${subtotal.toFixed(2)}\n` +
            `Tax (5.25%): ₹${taxAmount.toFixed(2)}\n` +
            `------------------------------------\n` +
            `TOTAL      : ₹${totalWithTax.toFixed(2)}\n` +
            `Payment    : ${paymentMethod || "Not Selected"}\n` +
            `====================================\n` +
            `     Thank you for your order!      \n` +
            `====================================`
        );
    };

    return (
        <div className="border-t border-[#2d2d2d]/30 px-6 py-4 bg-[#161616]/40 shrink-0">
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#ababab] font-medium">
                    <span>Items ({totalItems})</span>
                    <span className="text-[#f5f5f5] font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#ababab] font-medium">
                    <span>Tax (5.25%)</span>
                    <span className="text-[#f5f5f5] font-bold">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#f5f5f5] font-semibold pt-2 border-t border-[#2d2d2d]/20">
                    <span>Total With Tax</span>
                    <span className="text-[#f6b100] font-bold text-base">₹{totalWithTax.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={() => setPaymentMethod("Cash")}
                    disabled={cartItems.length === 0}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all border ${cartItems.length === 0
                            ? "bg-[#1a1a1a]/40 border-[#2d2d2d]/20 text-[#666666] cursor-not-allowed opacity-50"
                            : paymentMethod === "Cash"
                                ? "bg-[#f6b100]/10 border-[#f6b100] text-[#f6b100] cursor-pointer"
                                : "bg-[#1a1a1a] border-[#2d2d2d]/60 text-[#ababab] hover:bg-[#222222] cursor-pointer"
                        }`}
                >
                    Cash
                </button>
                <button
                    onClick={() => setPaymentMethod("Online")}
                    disabled={cartItems.length === 0}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all border ${cartItems.length === 0
                            ? "bg-[#1a1a1a]/40 border-[#2d2d2d]/20 text-[#666666] cursor-not-allowed opacity-50"
                            : paymentMethod === "Online"
                                ? "bg-[#f6b100]/10 border-[#f6b100] text-[#f6b100] cursor-pointer"
                                : "bg-[#1a1a1a] border-[#2d2d2d]/60 text-[#ababab] hover:bg-[#222222] cursor-pointer"
                        }`}
                >
                    Online
                </button>
            </div>

            {/* Order Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={handlePrintReceipt}
                    disabled={cartItems.length === 0}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all text-center border ${cartItems.length === 0
                            ? "bg-[#025cca]/5 border-[#025cca]/10 text-[#555] cursor-not-allowed opacity-50"
                            : "bg-[#025cca]/10 hover:bg-[#025cca]/20 border-[#025cca]/30 text-[#025cca] hover:text-white cursor-pointer active:scale-98"
                        }`}
                >
                    Print Receipt
                </button>
                <button
                    onClick={handlePlaceOrder}
                    disabled={cartItems.length === 0}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all text-center ${cartItems.length === 0
                            ? "bg-[#2d2d2d] text-[#666] cursor-not-allowed opacity-50"
                            : "bg-[#f6b100] hover:bg-[#f6b100]/90 text-[#1f1f1f] cursor-pointer active:scale-98 shadow-md shadow-[#f6b100]/5"
                        }`}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Bill;