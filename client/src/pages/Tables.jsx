import BottomNav from "../components/shared/BottomNav"
import TableCard from "../components/tables/TableCard"
import BackButton from "../components/shared/BackButton"
import { useState } from "react";
import { tables } from "../constants";

const Tables = () => {
    const [status, setStatus] = useState("all");

    const filteredTables = status === "all"
        ? tables
        : tables.filter(table => table.status?.toLowerCase() === status.toLowerCase());

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
                    <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wide">Tables</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setStatus("all")} className={getTabClass("all")}>
                        All
                    </button>
                    <button onClick={() => setStatus("booked")} className={getTabClass("booked")}>
                        Booked
                    </button>
                    <button onClick={() => setStatus("available")} className={getTabClass("available")}>
                        Available
                    </button>
                </div>
            </div>

            {/* Grid container for TableCards */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-10 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12 justify-items-center">
                    {filteredTables.map(table => (
                        <TableCard
                            key={table.id}
                            id={table.id}
                            name={table.name || table.tableNo}
                            status={table.status}
                            initials={table.initial || table.currentOrder?.customerDetails?.name}
                            seats={table.seats}
                        />
                    ))}
                </div>
            </div>
            <BottomNav />
        </section>
    );
};

export default Tables;