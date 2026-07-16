import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, loadSessionItems, clearSessionItems } from "../../redux/slices/cartSlice";
import { removeCustomerDetails, updateTable } from "../../redux/slices/customerSlice";
import { apiRequest } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { generateInvoicePDF } from "../../utils/generateInvoice";

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
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const isWaiter = user?.role === "Waiter";

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [taxPercent, setTaxPercent] = useState(18); // default fallback 18% GST
    const [restaurantName, setRestaurantName] = useState("Taste Hub");
    const cartItems = useSelector((state) => state.cart.cartItems);
    const sessionItems = useSelector((state) => state.cart.sessionItems || []);
    const customerData = useSelector((state) => state.customer);

    useEffect(() => {
        const fetchTaxSettings = async () => {
            try {
                const res = await apiRequest("/settings");
                if (res.success && res.data) {
                    if (res.data.taxRate !== undefined) {
                        setTaxPercent(res.data.taxRate);
                    }
                    if (res.data.restaurantName) {
                        setRestaurantName(res.data.restaurantName);
                    }
                }
            } catch (error) {
                console.error("Error loading tax settings:", error);
            }
        };
        fetchTaxSettings();
    }, []);

    // Calculations: subtotal, tax, total consolidated for both placed and new cart items
    const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const sessionSubtotal = sessionItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = cartSubtotal + sessionSubtotal;

    const taxRate = taxPercent / 100;
    const taxAmount = subtotal * taxRate;
    const totalWithTax = subtotal + taxAmount;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0) + sessionItems.reduce((sum, item) => sum + item.quantity, 0);

    const triggerPDFInvoice = (payMethod = "Cash") => {
        const allItems = [...sessionItems, ...cartItems];
        if (allItems.length === 0) return;

        generateInvoicePDF({
            restaurantName,
            orderId: customerData?.orderId || "N/A",
            customerName: customerData?.customerName || "Walk-in Customer",
            customerPhone: customerData?.customerMobileNumber || "",
            tableNumber: customerData?.tableNumber || "Takeaway",
            date: new Date().toLocaleString(),
            items: allItems,
            subtotal,
            taxPercent,
            taxAmount,
            total: totalWithTax,
            paymentMethod: payMethod
        });
    };

    const submitOrder = async (orderData, isKitchenOnly) => {
        try {
            if (isKitchenOnly) {
                // Placing new kitchen order tickets
                let sessionRes;
                if (customerData.activeOrderId) {
                    // Append order to active Table Session
                    sessionRes = await apiRequest(`/session/${customerData.activeOrderId}/order`, {
                        method: "POST",
                        body: {
                            items: orderData.items,
                            bills: orderData.bills,
                            orderId: orderData.orderId
                        }
                    });
                } else {
                    // Create new Table Session
                    sessionRes = await apiRequest("/session", {
                        method: "POST",
                        body: {
                            tableId: customerData.tableId,
                            customerDetails: orderData.customerDetails,
                            items: orderData.items,
                            bills: orderData.bills,
                            orderId: orderData.orderId
                        }
                    });
                }

                if (sessionRes.success) {
                    const sessionData = sessionRes.data;
                    toast.success("Order sent to kitchen successfully!");

                    // Re-consolidate active session items
                    const sessionOrders = sessionData.orders || [];
                    const sessionItemsList = [];
                    sessionOrders.forEach(order => {
                        const orderItems = order.items || [];
                        orderItems.forEach(item => {
                            sessionItemsList.push({
                                id: item.id,
                                name: item.name,
                                price: item.pricePerQuantity || item.price,
                                quantity: item.quantity,
                                notes: item.notes || "",
                                status: order.orderStatus || "In Progress"
                            });
                        });
                    });

                    dispatch(loadSessionItems(sessionItemsList));
                    dispatch(clearCart()); // clear draft cart
                    dispatch(updateTable({
                        activeOrderId: sessionData._id,
                        orderId: sessionData.orders?.[0]?.orderId || ""
                    }));
                }
            } else {
                // Processing final session payment checkout (Cashier/Admin)
                if (!customerData.activeOrderId) {
                    toast.error("No active session found to close.");
                    return;
                }

                const payRes = await apiRequest(`/session/${customerData.activeOrderId}/pay`, {
                    method: "POST",
                    body: {
                        paymentMethod: orderData.paymentMethod,
                        paymentData: orderData.paymentData
                    }
                });

                if (payRes.success) {
                    toast.success("Table session completed and payment processed!");
                    
                    // Trigger PDF Invoice Auto Download
                    triggerPDFInvoice(orderData.paymentMethod);

                    dispatch(clearCart());
                    dispatch(clearSessionItems());
                    dispatch(removeCustomerDetails());
                    setPaymentMethod(null);
                    navigate("/tables");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to submit POS request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePlaceOrder = async (kitchenOnly = false) => {
        const isKitchenOnly = isWaiter || kitchenOnly;

        if (isKitchenOnly && cartItems.length === 0) {
            toast.error("Please add new items to the cart before sending to kitchen.");
            return;
        }

        if (isSubmitting) return;

        if (!isKitchenOnly && !paymentMethod) {
            toast.error("Please select a payment method before completing checkout.");
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
            bills: {
                total: cartSubtotal,
                tax: cartSubtotal * taxRate,
                totalWithTax: cartSubtotal + (cartSubtotal * taxRate)
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
            // Cash checkout or kitchenOnly path
            await submitOrder(orderData, isKitchenOnly);
        }
    };

    const handlePrintReceipt = () => {
        triggerPDFInvoice(paymentMethod || "Cash");
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
                        disabled={cartItems.length === 0 && sessionItems.length === 0}
                        className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all border ${cartItems.length === 0 && sessionItems.length === 0
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
                        disabled={cartItems.length === 0 && sessionItems.length === 0}
                        className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all border ${cartItems.length === 0 && sessionItems.length === 0
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
                        disabled={cartItems.length === 0 && sessionItems.length === 0}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all text-center border ${
                            cartItems.length === 0 && sessionItems.length === 0
                                ? "bg-[#025cca]/5 border-[#025cca]/10 text-[#666666] cursor-not-allowed opacity-50"
                                : "bg-[#025cca]/10 hover:bg-[#025cca]/20 border-[#025cca]/30 text-[#025cca] hover:text-white cursor-pointer active:scale-95"
                        }`}
                    >
                        Download PDF Invoice
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
                        disabled={
                            isWaiter 
                                ? cartItems.length === 0 
                                : customerData.tableId 
                                    ? (cartItems.length === 0 && sessionItems.length === 0) 
                                    : cartItems.length === 0
                        }
                        className={`py-3 rounded-xl font-bold text-xs transition-all text-center shadow-md shadow-[#f6b100]/5 ${
                            isWaiter ? "w-full" : "flex-1"
                        } ${
                            (isWaiter 
                                ? cartItems.length === 0 
                                : customerData.tableId 
                                    ? (cartItems.length === 0 && sessionItems.length === 0) 
                                    : cartItems.length === 0)
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