import CategoryCard from "./CategoryCard";

const CategoryList = ({ menus, selectedMenuId, onSelectMenu }) => {
    return (
        <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%] shrink-0">
            {menus.map((menu) => (
                <CategoryCard
                    key={menu._id || menu.id}
                    menu={menu}
                    isSelected={selectedMenuId === (menu._id || menu.id)}
                    onClick={() => onSelectMenu(menu)}
                />
            ))}
        </div>
    );
};

export default CategoryList;
