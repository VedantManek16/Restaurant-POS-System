import CustomerInfo from "@/components/menu/CustomerInfo"
import MenuContainer from "@/components/menu/MenuContainer"
import BackButton from "@/components/shared/BackButton"
import BottomNav from "@/components/shared/BottomNav"
import { MdRestaurantMenu } from "react-icons/md"
import Bill from "@/components/menu/Bill"
import CartInfo from "@/components/menu/CartInfo"
import { useSelector } from "react-redux"

const Menu = () => {
    const customerData = useSelector((state) => state.customer);
    return (
        <section className="bg-[#1f1f1f] h-[calc(100vh-4.5rem)] overflow-hidden flex gap-3 pb-16">
            {/* Left Div */}
            <div className="flex-3 flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between px-10 py-3 shrink-0">
                    <div className="flex items-center gap-4">
                        <BackButton />
                        <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wide">Menu</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
                            <MdRestaurantMenu className="text-[#f5f5f5] text-3xl" />
                            <div className="flex flex-col items-start leading-tight">
                                <h1 className="text-xs text-[#f5f5f5] font-semibold">{customerData?.customerName || "Walk-in Customer"}</h1>
                                <p className="text-[10px] text-[#ababab] font-medium">
                                    {customerData?.tableNumber && customerData.tableNumber !== 'Takeaway'
                                        ? `Table No: ${customerData.tableNumber}`
                                        : 'Takeaway'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <MenuContainer />
            </div>

            {/* Right Div */}
            <div className="flex-1 min-w-0 overflow-hidden border-l border-[#2d2d2d]/30 flex flex-col bg-[#1a1a1a]/40">
                {/* Customer Information */}
                <CustomerInfo />
                {/* Cart Items */}
                <CartInfo />
                {/* Bills */}
                <Bill />
            </div>
            <BottomNav />
        </section>
    )
}
export default Menu