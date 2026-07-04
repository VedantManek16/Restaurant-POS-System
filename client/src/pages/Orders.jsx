import BottomNav from "../components/shared/BottomNav"
import OrderCard from "../components/orders/OrderCard"
import BackButton from "../components/shared/BackButton"
import { useState } from "react";
import { dummyOrders } from "../constants";

const Orders = () => {
  const [status, setStatus] = useState("all");

  const filteredOrders = status === "all"
    ? dummyOrders
    : dummyOrders.filter(order => order.status === status);

  const getTabClass = (tabStatus) => {
    return status === tabStatus
      ? "text-xs font-semibold text-[#f5f5f5] bg-[#383838] border border-[#4d4d4d]/30 px-4 py-1.5 rounded-full transition-all cursor-pointer"
      : "text-xs font-medium text-[#ababab] hover:text-[#f5f5f5] hover:bg-[#2d2d2d]/30 px-4 py-1.5 rounded-full transition-all cursor-pointer border border-transparent";
  };

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col pb-16">
      {/* Header section with Filter tabs */}
      <div className="flex items-center justify-between px-10 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wide">Orders</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setStatus("all")} className={getTabClass("all")}>
            All
          </button>
          <button onClick={() => setStatus("progress")} className={getTabClass("progress")}>
            In Progress
          </button>
          <button onClick={() => setStatus("ready")} className={getTabClass("ready")}>
            Ready
          </button>
          <button onClick={() => setStatus("completed")} className={getTabClass("completed")}>
            Completed
          </button>
        </div>
      </div>

      {/* Grid container for OrderCards */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-10 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12 justify-items-center">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
      <BottomNav />
    </section>
  )
}

export default Orders