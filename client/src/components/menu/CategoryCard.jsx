import { GrRadialSelected } from "react-icons/gr";

const CategoryCard = ({ menu, isSelected, onClick }) => {
    return (
        <div 
            onClick={onClick} 
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer hover:opacity-95 transition-all duration-200 active:scale-98 shadow-sm" 
            style={{ backgroundColor: menu.bgColor }}
        >
            <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                    {menu.icon} {menu.name}
                </h1>
                {isSelected && (
                    <GrRadialSelected className="text-white" size={20} />
                )}
            </div>
            <p className="text-[#e2e2e2]/80 text-sm font-medium">
                {menu.items.length} Items
            </p>
        </div>
    );
};

export default CategoryCard;
