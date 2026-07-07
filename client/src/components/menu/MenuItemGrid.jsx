import MenuItemCard from "./MenuItemCard";

const MenuItemGrid = ({ items, selectedMenuId, quantities, onIncrement, onDecrement }) => {
    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-10 py-4 pb-28">
            <div className="grid grid-cols-4 gap-4 w-[100%]">
                {items?.map((item) => {
                    const quantityKey = `${selectedMenuId}-${item.id}`;
                    const quantity = quantities[quantityKey] || 0;

                    return (
                        <MenuItemCard
                            key={item.id}
                            item={item}
                            quantity={quantity}
                            onIncrement={() => onIncrement(selectedMenuId, item.id)}
                            onDecrement={() => onDecrement(selectedMenuId, item.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default MenuItemGrid;
