import { menus } from "@/constants";
import { useState } from "react";
import CategoryList from "./CategoryList";
import MenuItemGrid from "./MenuItemGrid";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem } from "../../redux/slices/cartSlice";

const MenuContainer = () => {
    const [selected, setSelected] = useState(menus[0]);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);

    // Map cartItems to quantities object matching the structure: { "menuId-itemId": quantity }
    const quantities = cartItems.reduce((acc, item) => {
        const key = `${item.menuId}-${item.id}`;
        acc[key] = item.quantity;
        return acc;
    }, {});

    const increment = (menuId, itemId) => {
        const menu = menus.find((m) => m.id === menuId);
        const item = menu?.items.find((i) => i.id === itemId);
        if (item) {
            dispatch(addItem({ item, menuId }));
        }
    };

    const decrement = (menuId, itemId) => {
        dispatch(removeItem({ itemId, menuId }));
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <CategoryList
                menus={menus}
                selectedMenuId={selected.id}
                onSelectMenu={setSelected}
            />
            <hr className="border-[#2d2d2d]/60 border-t-2 mt-4 mx-10 shrink-0" />
            <MenuItemGrid
                items={selected?.items}
                selectedMenuId={selected.id}
                quantities={quantities}
                onIncrement={increment}
                onDecrement={decrement}
            />
        </div>
    );
};

export default MenuContainer;