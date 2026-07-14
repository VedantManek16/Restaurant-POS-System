import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { removeCustomerDetails } from "../../redux/slices/customerSlice";
import { apiRequest } from "../../utils/api";
import { toast } from "react-hot-toast";

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

const Bill = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const isWaiter = user?.role === "Waiter";

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [taxPercent, setTaxPercent] = useState(18); // default fallback 18% GST
    const cartItems = useSelector((state) => state.cart.cartItems);
    const customerData = useSelector((state) => state.customer);

    useEffect(() => {
        const fetchTaxSettings = async () => {
            try {
                const res = await apiRequest("/settings");
                if (res.success && res.data && res.data.taxRate !== undefined) {
                    setTaxPercent(res.data.taxRate);
                }
            } catch (error) {
                console.error("Error loading tax settings:", error);
            }
        };
        fetchTaxSettings();
    }, []);

    // Calculations
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = taxPercent / 100;
    const taxAmount = subtotal * taxRate;
    const totalWithTax = subtotal + taxAmount;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const submitOrder = async (orderData, isKitchenOnly) => {
        try {
            let orderRes;
            if (customerData.activeOrderId) {
                // Update existing active order
                orderRes = await apiRequest(`/order/${customerData.activeOrderId}`, {
                    method: "PUT",
                    body: orderData
                });
            } else {
                // Create new order
                orderRes = await apiRequest("/order", {
                    method: "POST",
                    body: orderData
                });
            }

            if (orderRes.success) {
                const targetOrderId = customerData.activeOrderId || orderRes.data._id;

                // Handle table status update
                if (customerData.tableId) {
                    const nextTableStatus = isKitchenOnly ? "Booked" : "Available";
                    await apiRequest(`/table/${customerData.tableId}`, {
                        method: "PUT",
                        body: {
                            status: nextTableStatus,
                            orderId: isKitchenOnly ? targetOrderId : null
                        }
                    });
                }

                toast.success(
                    isKitchenOnly
                        ? "Order sent to kitchen successfully!"
                        : "Order placed & settled successfully!"
                );

                // Reset session
                dispatch(clearCart());
                dispatch(removeCustomerDetails());
                setPaymentMethod(null);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to submit order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePlaceOrder = async (kitchenOnly = false) => {
        if (cartItems.length === 0 || isSubmitting) return;

        const isKitchenOnly = isWaiter || kitchenOnly;

        if (!isKitchenOnly && !paymentMethod) {
            toast.error("Please select a payment method before placing the order.");
            return;
        }

        setIsSubmitting(true);
        const orderData = {
            orderId: customerData.orderId,
            customerDetails: {
                name: customerData.customerName || "Walk-in Customer",
                phone: customerData.customerMobileNumber || "0000000000",
                guests: customerData.guests || 1
            },
            orderStatus: isKitchenOnly ? "In Progress" : "Completed",
            bills: {
                total: subtotal,
                tax: taxAmount,
                totalWithTax: totalWithTax
            },
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                pricePerQuantity: item.price,
                quantity: item.quantity,
                price: item.price * item.quantity,
                notes: item.notes || ""
            })),
            table: customerData.tableId || null,
            paymentMethod: isKitchenOnly ? "Cash" : paymentMethod
        };

        if (paymentMethod === "Online" && !isKitchenOnly) {
            try {
                const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
                if (!sdkLoaded) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    setIsSubmitting(false);
                    return;
                }

                const createPayOrder = await apiRequest("/payment/create-order", {
                    method: "POST",
                    body: { amount: totalWithTax }
                });

                if (!createPayOrder.success) {
                    toast.error("Failed to create online payment order.");
                    setIsSubmitting(false);
                    return;
                }

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
                    amount: createPayOrder.order.amount,
                    currency: createPayOrder.order.currency,
                    name: "RestroDesk",
                    description: "Secure Payment for Meal",
                    order_id: createPayOrder.order.id,
                    handler: async function (response) {
                        try {
                            const verifyRes = await apiRequest("/payment/verify-payment", {
                                method: "POST",
                                body: response
                            });

                            if (verifyRes.success) {
                                orderData.paymentData = {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id
                                };
                                await submitOrder(orderData, isKitchenOnly);
                            }
                        } catch (err) {
                            console.error(err);
                            toast.error("Payment verification failed.");
                            setIsSubmitting(false);
                        }
                    },
                    prefill: {
                        name: customerData.customerName,
                        contact: customerData.customerMobileNumber
                    },
                    theme: { color: "#f6b100" }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

            } catch (error) {
                console.error(error);
                toast.error("Razorpay checkout failed.");
                setIsSubmitting(false);
            }
        } else {
            // Cash or kitchenOnly path
            await submitOrder(orderData, isKitchenOnly);
        }
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
            `Tax (${taxPercent}%): ₹${taxAmount.toFixed(2)}\n` +
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
                    <span>Tax ({taxPercent}%)</span>
                    <span className="text-[#f5f5f5] font-bold">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#f5f5f5] font-semibold pt-2 border-t border-[#2d2d2d]/20">
                    <span>Total With Tax</span>
                    <span className="text-[#f6b100] font-bold text-base">₹{totalWithTax.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Methods (Hidden for Waiters) */}
            {!isWaiter && (
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
            )}

            {/* Order Action Buttons */}
            <div className="flex flex-col gap-3 mt-4 w-full">
                {!isWaiter && (
                    <button
                        onClick={handlePrintReceipt}
                        disabled={cartItems.length === 0}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all text-center border ${cartItems.length === 0
                            ? "bg-[#025cca]/5 border-[#025cca]/10 text-[#666666] cursor-not-allowed opacity-50"
                            : "bg-[#025cca]/10 hover:bg-[#025cca]/20 border-[#025cca]/30 text-[#025cca] hover:text-white cursor-pointer active:scale-95"
                            }`}
                    >
                        Print Receipt
                    </button>
                )}
                
                <div className="flex items-center gap-3 w-full">
                    {!isWaiter && customerData.tableId && (
                        <button
                            onClick={() => handlePlaceOrder(true)}
                            disabled={cartItems.length === 0}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all text-center border ${cartItems.length === 0
                                ? "bg-[#1f1f1f]/50 border-[#2d2d2d]/30 text-gray-500 cursor-not-allowed"
                                : "bg-transparent border-[#f6b100] hover:bg-[#f6b100]/10 text-[#f6b100] cursor-pointer active:scale-95"
                                }`}
                        >
                            Send to Kitchen
                        </button>
                    )}

                    <button
                        onClick={() => handlePlaceOrder(false)}
                        disabled={cartItems.length === 0}
                        className={`py-3 rounded-xl font-bold text-xs transition-all text-center shadow-md shadow-[#f6b100]/5 ${
                            isWaiter ? "w-full" : "flex-1"
                        } ${cartItems.length === 0
                                ? "bg-[#2d2d2d] text-[#666] cursor-not-allowed opacity-50"
                                : "bg-[#f6b100] hover:bg-[#f6b100]/90 text-[#1f1f1f] cursor-pointer active:scale-95"
                            }`}
                    >
                        {isWaiter ? "Send to Kitchen" : (customerData.tableId ? "Pay & Complete" : "Place Order")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Bill;