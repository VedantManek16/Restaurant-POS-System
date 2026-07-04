import { menus } from "@/constants";
import { useState } from "react";
import { GrRadialSelected } from "react-icons/gr";

const MenuContainer = () => {
    const [selected, setSelected] = useState(menus[0]);
    const [count, setCount] = useState(0);

    const increment = () => {

        setCount((prev) => prev + 1);
    };

    const decrement = () => {
        if (count <= 0) return;
        setCount((prev) => prev - 1);
    };
    return (
        <>
            <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
                {
                    menus.map((menu) => {
                        return (
                            <div key={menu.id} onClick={() => setSelected(menu)} className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer" style={{ backgroundColor: menu.bgColor }}>
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="text-[#f5f5f5] text-lg font-semibold">
                                        {menu.icon} {menu.name}
                                    </h1>
                                    {selected.id === menu.id && (
                                        <GrRadialSelected className="text-white" size={20} />
                                    )}
                                </div>
                                <p className="text-[#ababab] text-sm font-semibold">
                                    {menu.items.length} Items
                                </p>
                            </div>
                        )
                    })
                }
            </div>
            <hr className="border-[#2a2a2a] border-t-2 mt-4" />
            <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
                {
                    selected?.items.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
                            >
                                <div className="flex items-start justify-between w-full">
                                    <h1 className="text-[#f5f5f5] text-lg font-semibold">
                                        {item.name}
                                    </h1>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-[#f5f5f5] text-xl font-bold">
                                        ₹{item.price}
                                    </p>
                                    <div className="flex items-center justify-between bg-[#141414] border border-[#2d2d2d]/80 px-4 py-2.5 rounded-xl">
                                        <button onClick={decrement} className="text-xl font-bold text-[#f6b100] hover:text-yellow-400 transition-colors cursor-pointer select-none">&minus;</button>
                                        <span className="text-xs font-semibold text-[#f5f5f5]">{count} </span>
                                        <button onClick={increment} className="text-xl font-bold text-[#f6b100] hover:text-yellow-400 transition-colors cursor-pointer select-none">&#43;</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default MenuContainer;