import BottomNav from "../components/shared/BottomNav"
import TableCard from "../components/tables/TableCard"
import BackButton from "../components/shared/BackButton"
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import Modal from "../components/shared/Modal";
import { toast } from "react-hot-toast";

const Tables = () => {
    const [status, setStatus] = useState("all");
    const [tablesData, setTablesData] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTableNo, setNewTableNo] = useState("");
    const [newTableSeats, setNewTableSeats] = useState(4);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useSelector((state) => state.user);
    const isRestaurantAdmin = user?.role === "Restaurant Admin";

    const fetchTables = async () => {
        try {
            const res = await apiRequest("/table");
            if (res.success) {
                setTablesData(res.data);
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchTables();
        };
        load();
    }, []);

    const handleAddTable = async (e) => {
        e.preventDefault();
        if (!newTableNo) {
            toast.error("Please enter a table number.");
            return;
        }
        try {
            const res = await apiRequest("/table", {
                method: "POST",
                body: {
                    tableNo: newTableNo,
                    seats: Number(newTableSeats)
                }
            });
            if (res.success) {
                toast.success(`Table ${newTableNo} added successfully!`);
                setShowAddModal(false);
                setNewTableNo("");
                setNewTableSeats(4);
                fetchTables();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to add table.");
        }
    };

    const filteredTables = status === "all"
        ? tablesData
        : tablesData.filter(table => table.status?.toLowerCase() === status.toLowerCase());

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
                    {isRestaurantAdmin && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none border border-transparent"
                        >
                            <FaPlus size={10} /> Add Table
                        </button>
                    )}
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
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 w-full max-w-[280px] h-[130px] animate-pulse flex flex-col justify-between">
                                <div className="flex justify-between items-center w-full">
                                    <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                                    <div className="h-4 bg-neutral-800 rounded-full w-12"></div>
                                </div>
                                <div className="h-3 bg-neutral-800 rounded w-1/2 mt-4"></div>
                                <div className="h-3 bg-neutral-800 rounded w-1/4 mt-2"></div>
                            </div>
                        ))
                    ) : (
                        filteredTables.map(table => (
                            <TableCard
                                key={table._id}
                                id={table._id}
                                name={table.tableNo}
                                status={table.status}
                                initials={table.currentOrder?.customerDetails?.name}
                                seats={table.seats}
                                currentOrder={table.currentOrder}
                                onDelete={fetchTables}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Add Table Modal */}
            {showAddModal && (
                <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Table">
                    <form onSubmit={handleAddTable} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-[#ababab] uppercase tracking-wider mb-2">Table Number/Name</label>
                            <div className="flex items-center rounded-xl p-3 bg-[#141414] border border-[#2d2d2d]/80 focus-within:border-[#f6b100]/50 transition-colors">
                                <input
                                    value={newTableNo}
                                    onChange={(e) => setNewTableNo(e.target.value)}
                                    type="text"
                                    placeholder="e.g. Table 16"
                                    className="bg-transparent flex-1 text-xs text-[#f5f5f5] placeholder-[#555] focus:outline-none w-full"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-[#ababab] uppercase tracking-wider mb-2">Capacity (Seats)</label>
                            <div className="flex items-center rounded-xl p-3 bg-[#141414] border border-[#2d2d2d]/80 focus-within:border-[#f6b100]/50 transition-colors">
                                <input
                                    value={newTableSeats}
                                    onChange={(e) => setNewTableSeats(e.target.value)}
                                    type="number"
                                    min="1"
                                    max="20"
                                    placeholder="Number of seats"
                                    className="bg-transparent flex-1 text-xs text-[#f5f5f5] placeholder-[#555] focus:outline-none w-full"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-4 bg-[#f6b100] text-[#1a1a1a] py-3 rounded-xl hover:bg-[#e0a100] active:scale-[0.98] transition-all font-bold text-xs tracking-wider uppercase cursor-pointer"
                        >
                            Add Table
                        </button>
                    </form>
                </Modal>
            )}

            <BottomNav />
        </section>
    );
};

export default Tables;