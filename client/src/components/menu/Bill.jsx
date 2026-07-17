import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, loadSessionItems, clearSessionItems } from "../../redux/slices/cartSlice";
import { removeCustomerDetails, updateTable } from "../../redux/slices/customerSlice";
import { apiRequest } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { generateInvoicePDF } from "../../utils/generateInvoice";
import { printThermalReceipt } from "../../utils/printReceipt";

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

    const [settings, setSettings] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);

    useEffect(() => {
        const fetchTaxSettings = async () => {
            try {
                const res = await apiRequest("/settings");
                if (res.success && res.data) {
                    setSettings(res.data);
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

    const handleCloseReceiptModal = () => {
        dispatch(clearCart());
        dispatch(clearSessionItems());
        dispatch(removeCustomerDetails());
        setPaymentMethod(null);
        setShowReceiptModal(false);
        setCompletedOrder(null);
        navigate("/tables");
    };

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
            paymentMethod: payMethod,
            logoUrl: settings?.logoUrl || "",
            upiId: settings?.upiId || "",
            upiName: settings?.upiName || "",
            upiQrUrl: settings?.upiQrUrl || "",
            serviceCharge: settings?.serviceCharge || 0
        });
    };

    const submitOrder = async (orderData, isKitchenOnly) => {
        try {
            if (isKitchenOnly) {
                // Placing new kitchen order tickets
                let sessionRes;
                if (!customerData.tableId) {
                    // Takeaway order sent to kitchen: submit directly to /order
                    sessionRes = await apiRequest("/order", {
                        method: "POST",
                        body: {
                            orderId: orderData.orderId,
                            customerDetails: orderData.customerDetails,
                            bills: orderData.bills,
                            items: orderData.items,
                            table: null,
                            paymentMethod: "Cash",
                            orderStatus: "In Progress"
                        }
                    });
                    if (sessionRes.success) {
                        toast.success("Order sent to kitchen successfully!");
                        dispatch(clearCart());
                        dispatch(clearSessionItems());
                        dispatch(removeCustomerDetails());
                        setPaymentMethod(null);
                        navigate("/tables");
                    }
                    return;
                }

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
                let payRes;
                if (!customerData.tableId) {
                    // Takeaway order: submit directly to /order (marked as Completed and Paid)
                    payRes = await apiRequest("/order", {
                        method: "POST",
                        body: {
                            orderId: orderData.orderId,
                            customerDetails: orderData.customerDetails,
                            bills: orderData.bills,
                            items: orderData.items,
                            table: null,
                            paymentMethod: orderData.paymentMethod,
                            paymentData: orderData.paymentData,
                            orderStatus: "Completed"
                        }
                    });
                } else {
                    // Dine-in order: process via Table Session
                    let targetSessionId = customerData.activeOrderId;

                    if (!targetSessionId) {
                        // Create new Table Session first before paying
                        const sessionRes = await apiRequest("/session", {
                            method: "POST",
                            body: {
                                tableId: customerData.tableId,
                                customerDetails: orderData.customerDetails,
                                items: orderData.items,
                                bills: orderData.bills,
                                orderId: orderData.orderId
                            }
                        });

                        if (sessionRes.success) {
                            targetSessionId = sessionRes.data._id;
                        } else {
                            toast.error("Failed to create order session.");
                            setIsSubmitting(false);
                            return;
                        }
                    }

                    payRes = await apiRequest(`/session/${targetSessionId}/pay`, {
                        method: "POST",
                        body: {
                            paymentMethod: orderData.paymentMethod,
                            paymentData: orderData.paymentData
                        }
                    });
                }

                if (payRes && payRes.success) {
                    toast.success("Order completed and payment processed!");
                    
                    // Capture final order data for receipt display
                    const receiptInfo = {
                        orderId: customerData.orderId || payRes.data?.orderId || "N/A",
                        customerName: customerData.customerName || "Walk-in Customer",
                        customerPhone: customerData.customerMobileNumber || "",
                        guests: customerData.guests || 1,
                        tableNumber: customerData.tableNumber || "Takeaway",
                        items: [...sessionItems, ...cartItems],
                        subtotal,
                        taxPercent,
                        taxAmount,
                        total: totalWithTax,
                        paymentMethod: orderData.paymentMethod,
                        paymentData: orderData.paymentData || null
                    };

                    setCompletedOrder(receiptInfo);
                    setShowReceiptModal(true);
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

            {/* Order Receipt Modal */}
            {showReceiptModal && completedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white text-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
                        {/* Scrollable Content Area */}
                        <div className="overflow-y-auto pr-1 select-text">
                            {/* Green Check Mark */}
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-center text-xl font-bold text-gray-900 font-sans">Order Receipt</h2>
                            <p className="text-center text-xs text-gray-500 mt-1 font-sans">Thank you for your order!</p>
                            
                            <hr className="border-gray-200 my-4" />

                            {/* Customer & Order Details */}
                            <div className="space-y-1.5 text-xs text-gray-600 font-sans">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-700">Order ID:</span>
                                    <span className="text-gray-900 font-medium">{completedOrder.orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-700">Name:</span>
                                    <span className="text-gray-900 font-medium">{completedOrder.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-700">Phone:</span>
                                    <span className="text-gray-900 font-medium">{completedOrder.customerPhone || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-700">Guests:</span>
                                    <span className="text-gray-900 font-medium">{completedOrder.guests}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-700">Table:</span>
                                    <span className="text-gray-900 font-medium">
                                        {completedOrder.tableNumber && completedOrder.tableNumber !== "Takeaway"
                                            ? completedOrder.tableNumber
                                            : "Takeaway"}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-gray-200 my-4" />

                            {/* Items list */}
                            <div className="space-y-3 font-sans">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Items Ordered</h3>
                                <div className="space-y-2">
                                    {completedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-xs text-gray-700">
                                            <span>
                                                {item.name} <span className="text-gray-400 font-bold ml-1">x{item.quantity}</span>
                                            </span>
                                            <span className="font-semibold text-gray-900">₹{Number(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-gray-200 my-4" />

                            {/* Totals */}
                            <div className="space-y-1.5 text-xs text-gray-600 font-sans">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-medium text-gray-900">₹{completedOrder.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax ({completedOrder.taxPercent}%):</span>
                                    <span className="font-medium text-gray-900">₹{completedOrder.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-100">
                                    <span>Grand Total:</span>
                                    <span>₹{completedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment details */}
                            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded-lg font-sans">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-700">Payment Method:</span>
                                    <span className="text-gray-900 font-semibold">{completedOrder.paymentMethod}</span>
                                </div>
                                {completedOrder.paymentMethod === "Online" && (
                                    <>
                                        <div className="flex flex-col text-[10px] text-gray-500 mt-1">
                                            <span className="font-semibold">Razorpay Order ID:</span>
                                            <span className="break-all text-gray-700">{completedOrder.paymentData?.razorpay_order_id || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col text-[10px] text-gray-500 mt-1">
                                            <span className="font-semibold">Razorpay Payment ID:</span>
                                            <span className="break-all text-gray-700">{completedOrder.paymentData?.razorpay_payment_id || "N/A"}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action buttons footer */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 shrink-0 font-sans">
                            <button
                                onClick={() => printThermalReceipt(completedOrder, settings || {})}
                                className="text-[#025cca] hover:text-[#025cca]/80 font-bold text-xs cursor-pointer flex items-center gap-1 active:scale-95 transition-transform"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Receipt
                            </button>
                            
                            <button
                                onClick={() => {
                                    generateInvoicePDF({
                                        restaurantName: settings?.restaurantName || restaurantName,
                                        orderId: completedOrder.orderId,
                                        customerName: completedOrder.customerName,
                                        customerPhone: completedOrder.customerPhone,
                                        tableNumber: completedOrder.tableNumber,
                                        date: new Date().toLocaleString(),
                                        items: completedOrder.items,
                                        subtotal: completedOrder.subtotal,
                                        taxPercent: completedOrder.taxPercent,
                                        taxAmount: completedOrder.taxAmount,
                                        total: completedOrder.total,
                                        paymentMethod: completedOrder.paymentMethod,
                                        logoUrl: settings?.logoUrl || "",
                                        upiId: settings?.upiId || "",
                                        upiName: settings?.upiName || "",
                                        upiQrUrl: settings?.upiQrUrl || "",
                                        serviceCharge: settings?.serviceCharge || 0
                                    });
                                }}
                                className="text-[#025cca] hover:text-[#025cca]/80 font-bold text-xs cursor-pointer flex items-center gap-1 active:scale-95 transition-transform"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Invoice
                            </button>

                            <button
                                onClick={handleCloseReceiptModal}
                                className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer active:scale-95 transition-transform"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bill;