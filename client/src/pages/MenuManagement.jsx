import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaListUl,
    FaFolderPlus,
    FaUtensils,
    FaImage,
    FaCircle,
    FaTimes
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { apiRequest } from "../utils/api";
import BackButton from "../components/shared/BackButton";

const MenuManagement = () => {
    const { user } = useSelector((state) => state.user);

    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Modal state controllers
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryModalMode, setCategoryModalMode] = useState("add"); // "add" or "edit"
    const [categoryFormData, setCategoryFormData] = useState({
        id: "",
        name: "",
        bgColor: "#b73e3e",
        icon: "🍲"
    });

    const [showDishModal, setShowDishModal] = useState(false);
    const [dishModalMode, setDishModalMode] = useState("add"); // "add" or "edit"
    const [selectedDishId, setSelectedDishId] = useState("");
    const [dishFormData, setDishFormData] = useState({
        name: "",
        price: "",
        description: "",
        isVeg: true,
        image: ""
    });

    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const res = await apiRequest("/menu");
            if (res.success && res.data) {
                setCategories(res.data);
                if (res.data.length > 0 && !selectedCategoryId) {
                    setSelectedCategoryId(res.data[0]._id);
                }
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
            toast.error("Failed to load menu data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    // CATEGORY HANDLERS
    const handleOpenCategoryModal = (mode, category = null) => {
        setCategoryModalMode(mode);
        if (mode === "edit" && category) {
            setCategoryFormData({
                id: category._id,
                name: category.name,
                bgColor: category.bgColor,
                icon: category.icon
            });
        } else {
            setCategoryFormData({
                id: "",
                name: "",
                bgColor: "#f6b100",
                icon: "🍲"
            });
        }
        setShowCategoryModal(true);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!categoryFormData.name) {
            toast.error("Category name is required.");
            return;
        }

        try {
            let res;
            if (categoryModalMode === "add") {
                res = await apiRequest("/menu/category", {
                    method: "POST",
                    body: {
                        name: categoryFormData.name,
                        bgColor: categoryFormData.bgColor,
                        icon: categoryFormData.icon
                    }
                });
            } else {
                res = await apiRequest(`/menu/category/${categoryFormData.id}`, {
                    method: "PUT",
                    body: {
                        name: categoryFormData.name,
                        bgColor: categoryFormData.bgColor,
                        icon: categoryFormData.icon
                    }
                });
            }

            if (res.success) {
                toast.success(`Category ${categoryModalMode === "add" ? "added" : "updated"} successfully!`);
                setShowCategoryModal(false);
                await fetchMenu();
                if (categoryModalMode === "add") {
                    setSelectedCategoryId(res.data._id);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to save category.");
        }
    };

    const handleDeleteCategory = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? All items inside this category will be removed.`)) {
            return;
        }
        try {
            const res = await apiRequest(`/menu/category/${id}`, { method: "DELETE" });
            if (res.success) {
                toast.success("Category deleted successfully.");
                if (selectedCategoryId === id) {
                    setSelectedCategoryId("");
                }
                await fetchMenu();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to delete category.");
        }
    };

    // DISH HANDLERS
    const handleOpenDishModal = (mode, dish = null) => {
        setDishModalMode(mode);
        if (mode === "edit" && dish) {
            setSelectedDishId(dish._id);
            setDishFormData({
                name: dish.name,
                price: dish.price,
                description: dish.description,
                isVeg: dish.isVeg,
                image: dish.image || ""
            });
        } else {
            setSelectedDishId("");
            setDishFormData({
                name: "",
                price: "",
                description: "",
                isVeg: true,
                image: ""
            });
        }
        setShowDishModal(true);
    };

    const handleDishImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // limit 2MB
                toast.error("Image file size should be less than 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setDishFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDishSubmit = async (e) => {
        e.preventDefault();
        if (!dishFormData.name || !dishFormData.price) {
            toast.error("Dish name and price are required.");
            return;
        }

        try {
            let res;
            if (dishModalMode === "add") {
                res = await apiRequest(`/menu/category/${selectedCategoryId}/dish`, {
                    method: "POST",
                    body: dishFormData
                });
            } else {
                res = await apiRequest(`/menu/category/${selectedCategoryId}/dish/${selectedDishId}`, {
                    method: "PUT",
                    body: dishFormData
                });
            }

            if (res.success) {
                toast.success(`Dish ${dishModalMode === "add" ? "added" : "updated"} successfully!`);
                setShowDishModal(false);
                await fetchMenu();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to save dish.");
        }
    };

    const handleDeleteDish = async (dishId, dishName) => {
        if (!window.confirm(`Are you sure you want to delete the dish "${dishName}"?`)) {
            return;
        }
        try {
            const res = await apiRequest(`/menu/category/${selectedCategoryId}/dish/${dishId}`, {
                method: "DELETE"
            });
            if (res.success) {
                toast.success("Dish deleted successfully.");
                await fetchMenu();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to delete dish.");
        }
    };

    const selectedCategory = categories.find(c => c._id === selectedCategoryId);

    return (
        <section className="bg-[#1f1f1f] h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col p-6 text-gray-300 relative select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Menu Customization</h1>
                        <p className="text-xs text-gray-400 mt-1">Manage categories, dishes, prices, and upload custom food photos.</p>
                    </div>
                </div>
            </div>

            {/* Layout Panels */}
            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left Panel: Categories */}
                <div className="w-1/3 bg-[#161616] rounded-2xl border border-white/5 flex flex-col min-h-0 overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-black/10 shrink-0">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                            <FaListUl className="text-[#f6b100]" /> Categories
                        </h2>
                        <button
                            onClick={() => handleOpenCategoryModal("add")}
                            className="bg-[#f6b100] hover:bg-[#e0a100] text-[#1a1a1a] text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer hover:shadow-lg hover:shadow-[#f6b100]/10"
                        >
                            <FaPlus /> Add Category
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-hide">
                        {categories.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 text-xs">No categories added yet.</div>
                        ) : (
                            categories.map(cat => (
                                <div
                                    key={cat._id}
                                    onClick={() => setSelectedCategoryId(cat._id)}
                                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${selectedCategoryId === cat._id
                                            ? "bg-[#252525] border-[#f6b100]/40 shadow-inner"
                                            : "bg-[#1d1d1d] border-transparent hover:border-white/10"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            style={{ backgroundColor: `${cat.bgColor}15`, color: cat.bgColor, borderColor: `${cat.bgColor}30` }}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-sm"
                                        >
                                            {cat.icon}
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold text-white">{cat.name}</p>
                                            <p className="text-[9px] text-gray-500 font-semibold">{cat.items?.length || 0} items</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenCategoryModal("edit", cat); }}
                                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer border border-transparent"
                                        >
                                            <FaEdit size={11} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id, cat.name); }}
                                            className="p-2 text-red-500/80 hover:text-red-400 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent"
                                        >
                                            <FaTrash size={11} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Dishes */}
                <div className="w-2/3 bg-[#161616] rounded-2xl border border-white/5 flex flex-col min-h-0 overflow-hidden">
                    {selectedCategory ? (
                        <>
                            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-black/10 shrink-0">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-lg">{selectedCategory.icon}</span>
                                    <div>
                                        <h2 className="text-sm font-bold text-white">{selectedCategory.name}</h2>
                                        <p className="text-[10px] text-gray-500 font-medium">Manage dishes under this category</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleOpenDishModal("add")}
                                    className="bg-transparent border border-[#f6b100] text-[#f6b100] hover:bg-[#f6b100]/10 text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                    <FaPlus /> Add New Dish
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                                {(!selectedCategory.items || selectedCategory.items.length === 0) ? (
                                    <div className="text-center py-20 text-gray-500 text-xs">
                                        No dishes in this category yet. Click "Add New Dish" to insert one.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
                                        {selectedCategory.items.map(dish => (
                                            <div
                                                key={dish._id}
                                                className="bg-[#1d1d1d] border border-white/5 rounded-xl p-4 flex gap-4 items-start relative hover:border-white/10 transition-colors"
                                            >
                                                {/* Dish Image */}
                                                <div className="w-16 h-16 rounded-lg bg-[#252525] border border-white/5 shrink-0 overflow-hidden flex items-center justify-center text-gray-500">
                                                    {dish.image ? (
                                                        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FaUtensils size={18} />
                                                    )}
                                                </div>

                                                {/* Dish Details */}
                                                <div className="flex-1 min-w-0 pr-12">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dish.isVeg ? "bg-emerald-500" : "bg-red-500"}`}></span>
                                                        <h3 className="text-xs font-bold text-white truncate">{dish.name}</h3>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-1 font-semibold">₹{dish.price.toFixed(2)}</p>
                                                    <p className="text-[9px] text-[#ababab] mt-1.5 line-clamp-2 leading-relaxed">
                                                        {dish.description || "No description provided."}
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="absolute right-4 top-4 flex flex-col gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenDishModal("edit", dish)}
                                                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer border border-transparent"
                                                    >
                                                        <FaEdit size={11} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDish(dish._id, dish.name)}
                                                        className="p-1.5 text-red-500/80 hover:text-red-400 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent"
                                                    >
                                                        <FaTrash size={11} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-500 text-xs gap-3">
                            <FaUtensils size={28} className="text-gray-600" />
                            Select a category from the left panel to manage its dishes.
                        </div>
                    )}
                </div>
            </div>

            {/* CATEGORY MODAL OVERLAY */}
            {showCategoryModal && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
                        <button
                            onClick={() => setShowCategoryModal(false)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-white cursor-pointer border border-transparent"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
                            <FaFolderPlus className="text-[#f6b100]" />
                            {categoryModalMode === "add" ? "Create Category" : "Edit Category"}
                        </h2>

                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={categoryFormData.name}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                                    placeholder="e.g. Desserts, Starters"
                                    className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f6b100]/50"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Emoji Icon</label>
                                    <input
                                        type="text"
                                        value={categoryFormData.icon}
                                        onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                                        placeholder="e.g. 🍰, 🍲"
                                        className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white text-center focus:outline-none focus:border-[#f6b100]/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Color Theme</label>
                                    <div className="flex gap-2 items-center bg-[#262626] border border-white/5 rounded-xl px-3 py-1.5">
                                        <input
                                            type="color"
                                            value={categoryFormData.bgColor}
                                            onChange={(e) => setCategoryFormData({ ...categoryFormData, bgColor: e.target.value })}
                                            className="w-7 h-7 bg-transparent rounded cursor-pointer border border-transparent"
                                        />
                                        <span className="text-[10px] text-gray-400 uppercase font-mono font-bold">{categoryFormData.bgColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(false)}
                                    className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#f6b100] hover:bg-[#e0a100] text-gray-950 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                                >
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DISH MODAL OVERLAY */}
            {showDishModal && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                        <button
                            onClick={() => setShowDishModal(false)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-white cursor-pointer border border-transparent"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
                            <FaUtensils className="text-[#f6b100]" />
                            {dishModalMode === "add" ? "Add New Dish" : "Edit Dish"}
                        </h2>

                        <form onSubmit={handleDishSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dish Name</label>
                                    <input
                                        type="text"
                                        value={dishFormData.name}
                                        onChange={(e) => setDishFormData({ ...dishFormData, name: e.target.value })}
                                        placeholder="e.g. Garlic Naan"
                                        className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f6b100]/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={dishFormData.price}
                                        onChange={(e) => setDishFormData({ ...dishFormData, price: e.target.value })}
                                        placeholder="e.g. 150"
                                        className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f6b100]/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    value={dishFormData.description}
                                    onChange={(e) => setDishFormData({ ...dishFormData, description: e.target.value })}
                                    placeholder="Brief description of ingredients or notes..."
                                    rows={2.5}
                                    className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f6b100]/50 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Diet Preference</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setDishFormData({ ...dishFormData, isVeg: true })}
                                            className={`flex-1 py-2 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${dishFormData.isVeg
                                                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                                                    : "bg-transparent border-white/5 text-gray-400 hover:bg-white/5"
                                                }`}
                                        >
                                            Veg
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDishFormData({ ...dishFormData, isVeg: false })}
                                            className={`flex-1 py-2 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${!dishFormData.isVeg
                                                    ? "bg-red-500/10 border-red-500 text-red-400"
                                                    : "bg-transparent border-white/5 text-gray-400 hover:bg-white/5"
                                                }`}
                                        >
                                            Non-Veg
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dish Photo</label>
                                    <div className="flex items-center bg-[#262626] border border-white/5 rounded-xl px-3 py-1.5 overflow-hidden">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleDishImageUpload}
                                            className="hidden"
                                            id="dish-file-upload"
                                        />
                                        <label
                                            htmlFor="dish-file-upload"
                                            className="w-full flex items-center justify-between text-[10px] font-bold text-gray-400 hover:text-white cursor-pointer select-none"
                                        >
                                            <span>{dishFormData.image ? "Change Photo" : "Upload File"}</span>
                                            {dishFormData.image ? (
                                                <span className="w-5 h-5 rounded overflow-hidden border border-white/10 shrink-0">
                                                    <img src={dishFormData.image} alt="preview" className="w-full h-full object-cover" />
                                                </span>
                                            ) : (
                                                <FaImage size={13} className="text-[#ababab]" />
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Or paste Image URL */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Or Paste Image URL</label>
                                <input
                                    type="text"
                                    value={dishFormData.image.startsWith("data:") ? "" : dishFormData.image}
                                    onChange={(e) => setDishFormData({ ...dishFormData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f6b100]/50"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDishModal(false)}
                                    className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#f6b100] hover:bg-[#e0a100] text-gray-950 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                                >
                                    Save Dish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MenuManagement;
