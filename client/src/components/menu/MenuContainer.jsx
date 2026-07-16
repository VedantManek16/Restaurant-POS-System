import { useState, useEffect } from "react";
import CategoryList from "./CategoryList";
import MenuItemGrid from "./MenuItemGrid";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem } from "../../redux/slices/cartSlice";
import { FaSearch } from "react-icons/fa";
import { apiRequest } from "../../utils/api";

const MenuContainer = () => {
    const [menus, setMenus] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dietFilter, setDietFilter] = useState("all"); // "all", "veg", "non-veg"
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);

    const loadMenu = async () => {
        setIsLoading(true);
        try {
            const res = await apiRequest("/menu");
            if (res.success && res.data) {
                setMenus(res.data);
                if (res.data.length > 0) {
                    setSelected(res.data[0]);
                }
            }
        } catch (error) {
            console.error("Error loading menu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMenu();
    }, []);

    // Reset filters when category changes
    const handleCategoryChange = (category) => {
        setSelected(category);
        setSearchQuery("");
        setDietFilter("all");
    };

    // Map cartItems to quantities object matching the structure: { "menuId-itemId": quantity }
    const quantities = cartItems.reduce((acc, item) => {
        const key = `${item.menuId}-${item.id}`;
        acc[key] = item.quantity;
        return acc;
    }, {});

    const increment = (menuId, itemId) => {
        const menu = menus.find((m) => m._id === menuId);
        const item = menu?.items.find((i) => i._id === itemId);
        if (item) {
            dispatch(addItem({
                item: {
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    isVeg: item.isVeg,
                    image: item.image,
                    category: item.isVeg ? "Vegetarian" : "Non-Vegetarian"
                },
                menuId
            }));
        }
    };

    const decrement = (menuId, itemId) => {
        dispatch(removeItem({ itemId, menuId }));
    };

    // Filter items based on search and diet criteria
    const filteredItems = selected?.items?.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiet =
            dietFilter === "all" ||
            (dietFilter === "veg" && (item.category === "Vegetarian" || item.isVeg === true)) ||
            (dietFilter === "non-veg" && (item.category === "Non-Vegetarian" || item.isVeg === false));
        return matchesSearch && matchesDiet;
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-xs text-[#ababab]">
                <span className="w-5 h-5 border-2 border-[#f6b100] border-t-transparent rounded-full animate-spin mr-2"></span>
                Loading dynamic menu...
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-xs text-gray-500 gap-2">
                No menu categories found.
                <p className="text-[10px] text-gray-600">Please log in as an Admin to create menu categories.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <CategoryList
                menus={menus}
                selectedMenuId={selected?._id}
                onSelectMenu={handleCategoryChange}
            />

            {/* Search & Diet Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 px-10 mt-4 shrink-0">
                {/* Search Bar */}
                <div className="flex-1 relative flex items-center bg-[#1a1a1a] rounded-xl border border-[#2d2d2d]/60 focus-within:border-[#f6b100]/50 transition-all">
                    <span className="absolute left-4 text-[#ababab]">
                        <FaSearch size={13} />
                    </span>
                    <input
                        type="text"
                        placeholder={`Search in ${selected?.name || "category"}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent pl-11 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                </div>

                {/* Diet Filter Selector */}
                <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-[#2d2d2d]/60">
                    <button
                        onClick={() => setDietFilter("all")}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${dietFilter === "all"
                                ? "bg-[#383838] text-white border border-[#4d4d4d]/30"
                                : "text-[#ababab] hover:text-white"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setDietFilter("veg")}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${dietFilter === "veg"
                                ? "bg-green-500/10 text-green-400 border border-green-500/25"
                                : "text-[#ababab] hover:text-green-400"
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Veg
                    </button>
                    <button
                        onClick={() => setDietFilter("non-veg")}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${dietFilter === "non-veg"
                                ? "bg-red-500/10 text-red-400 border border-red-500/25"
                                : "text-[#ababab] hover:text-red-400"
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        Non-Veg
                    </button>
                </div>
            </div>

            <hr className="border-[#2d2d2d]/60 border-t-2 mt-4 mx-10 shrink-0" />
            <MenuItemGrid
                items={filteredItems}
                selectedMenuId={selected?._id}
                quantities={quantities}
                onIncrement={increment}
                onDecrement={decrement}
            />
        </div>
    );
};

export default MenuContainer;