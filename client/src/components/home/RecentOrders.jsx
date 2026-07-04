import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";

const RecentOrders = () => {
    return (
        <div className="px-8 mt-5 flex-1 min-h-0 flex flex-col pb-4">
            <div className="bg-[#1a1a1a] w-full flex-1 flex flex-col rounded-xl border border-[#2d2d2d]/30 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4">
                    <h1 className="text-[#f5f5f5] text-md font-semibold tracking-wide">Recent Orders</h1>
                    <a href="" className="text-[#025cca] text-xs font-semibold hover:underline">View all</a>
                </div>
                {/* Search bar */}
                <div className="flex items-center gap-3 bg-[#1f1f1f] rounded-xl px-4 py-2 mx-6 border border-[#2d2d2d]/30">
                    <FaSearch className="text-[#ababab] text-xs" />
                    <input
                        type="text"
                        placeholder="Search recent orders"
                        className="bg-[#1f1f1f] outline-none text-[#f5f5f5] text-xs placeholder-[#ababab] w-full"
                    />
                </div >
                {/* Order list */}
                <div className="mt-4 px-6 overflow-y-auto flex-1 scrollbar-hide pb-2">
                    <OrderList />
                    <OrderList />
                    <OrderList />
                    <OrderList />
                    <OrderList />
                </div>
            </div>
        </div>
    )
}

export default RecentOrders;