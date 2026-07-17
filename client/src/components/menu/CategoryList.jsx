import CategoryCard from "./CategoryCard";

const CategoryList = ({ menus, selectedMenuId, onSelectMenu }) => {
    return (
        <div className="h-[250px] overflow-y-auto scrollbar-hide shrink-0">
            <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
                {menus.map((menu) => (
                    <CategoryCard
                        key={menu._id || menu.id}
                        menu={menu}
                        isSelected={selectedMenuId === (menu._id || menu.id)}
                        onClick={() => onSelectMenu(menu)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
