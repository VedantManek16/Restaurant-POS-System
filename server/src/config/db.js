import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "./config.js";
import User from "../models/userModel.js";
import MenuCategory from "../models/menuCategoryModel.js";

const seedDemoUsers = async () => {
    const demoUsers = [
        {
            name: "Super Admin",
            email: "superadmin@restro.com",
            password: "RestroDesk!2026",
            role: "Super Admin",
            phone: "1111111111",
            tenantId: "restrodesk",
            tenantName: "RestroDesk"
        },
        {
            name: "Taste Hub Admin",
            email: "admin@restro.com",
            password: "RestroDesk!2026",
            role: "Restaurant Admin",
            phone: "2222222222",
            tenantId: "taste-hub",
            tenantName: "Taste Hub"
        },
        {
            name: "Sarah Cashier",
            email: "cashier@restro.com",
            password: "RestroDesk!2026",
            role: "Cashier",
            phone: "3333333333",
            tenantId: "taste-hub",
            tenantName: "Taste Hub"
        },
        {
            name: "John Waiter",
            email: "waiter@restro.com",
            password: "RestroDesk!2026",
            role: "Waiter",
            phone: "4444444444",
            tenantId: "taste-hub",
            tenantName: "Taste Hub"
        },
        {
            name: "Chef Mario",
            email: "kitchen@restro.com",
            password: "RestroDesk!2026",
            role: "Kitchen Staff",
            phone: "8888888888",
            tenantId: "taste-hub",
            tenantName: "Taste Hub"
        },
        {
            name: "Pizza World Admin",
            email: "pizza@restro.com",
            password: "RestroDesk!2026",
            role: "Restaurant Admin",
            phone: "5555555555",
            tenantId: "pizza-world",
            tenantName: "Pizza World"
        },
        {
            name: "Burger Nation Admin",
            email: "burger@restro.com",
            password: "RestroDesk!2026",
            role: "Restaurant Admin",
            phone: "6666666666",
            tenantId: "burger-nation",
            tenantName: "Burger Nation"
        },
        {
            name: "Cafe Aroma Admin",
            email: "cafe@restro.com",
            password: "RestroDesk!2026",
            role: "Restaurant Admin",
            phone: "7777777777",
            tenantId: "cafe-aroma",
            tenantName: "Cafe Aroma"
        }
    ];

    try {
        const count = await User.countDocuments();
        if (count === 0) {
            for (const demoUser of demoUsers) {
                const newUser = new User(demoUser);
                await newUser.save();
            }
        } else {
            // Self-healing: Update demo user passwords if they are using the old ones
            for (const demoUser of demoUsers) {
                const userExists = await User.findOne({ email: demoUser.email });
                if (userExists) {
                    const isMatch = await bcrypt.compare(demoUser.password, userExists.password);
                    if (!isMatch) {
                        userExists.password = demoUser.password;
                        await userExists.save();
                    }
                } else {
                    const newUser = new User(demoUser);
                    await newUser.save();
                }
            }
        }
    } catch (error) {
        console.error("Error seeding demo users:", error);
    }
};

const seedMenuCategories = async () => {
    try {
        const count = await MenuCategory.countDocuments({ restaurantId: "taste-hub" });
        if (count === 0) {
            const defaultCategories = [
                {
                    name: "Starters",
                    bgColor: "#b73e3e",
                    icon: "🍲",
                    restaurantId: "taste-hub",
                    items: [
                        { name: "Paneer Tikka", price: 250, isVeg: true },
                        { name: "Chicken Tikka", price: 300, isVeg: false },
                        { name: "Tandoori Chicken", price: 350, isVeg: false },
                        { name: "Samosa", price: 100, isVeg: true },
                        { name: "Aloo Tikki", price: 120, isVeg: true },
                        { name: "Hara Bhara Kebab", price: 220, isVeg: true }
                    ]
                },
                {
                    name: "Main Course",
                    bgColor: "#5b45b0",
                    icon: "🍛",
                    restaurantId: "taste-hub",
                    items: [
                        { name: "Butter Chicken", price: 400, isVeg: false },
                        { name: "Paneer Butter Masala", price: 350, isVeg: true },
                        { name: "Chicken Biryani", price: 450, isVeg: false },
                        { name: "Dal Makhani", price: 180, isVeg: true },
                        { name: "Kadai Paneer", price: 300, isVeg: true },
                        { name: "Rogan Josh", price: 500, isVeg: false }
                    ]
                },
                {
                    name: "Beverages",
                    bgColor: "#7f167f",
                    icon: "🍹",
                    restaurantId: "taste-hub",
                    items: [
                        { name: "Masala Chai", price: 50, isVeg: true },
                        { name: "Lemon Soda", price: 80, isVeg: true },
                        { name: "Mango Lassi", price: 120, isVeg: true },
                        { name: "Cold Coffee", price: 150, isVeg: true },
                        { name: "Fresh Lime Water", price: 60, isVeg: true },
                        { name: "Iced Tea", price: 100, isVeg: true }
                    ]
                },
                {
                    name: "Soups",
                    bgColor: "#735f32",
                    icon: "🍜",
                    restaurantId: "taste-hub",
                    items: [
                        { name: "Tomato Soup", price: 120, isVeg: true },
                        { name: "Sweet Corn Soup", price: 130, isVeg: true },
                        { name: "Hot & Sour Soup", price: 140, isVeg: true },
                        { name: "Chicken Clear Soup", price: 160, isVeg: false },
                        { name: "Mushroom Soup", price: 150, isVeg: true },
                        { name: "Lemon Coriander Soup", price: 110, isVeg: true }
                    ]
                },
                {
                    name: "Desserts",
                    bgColor: "#1d2569",
                    icon: "🍰",
                    restaurantId: "taste-hub",
                    items: [
                        { name: "Gulab Jamun", price: 100, isVeg: true },
                        { name: "Kulfi", price: 150, isVeg: true },
                        { name: "Chocolate Lava Cake", price: 250, isVeg: true },
                        { name: "Ras Malai", price: 180, isVeg: true }
                    ]
                },
                {
                    name: "Pizzas",
                    bgColor: "#285430",
                    icon: "🍕",
                    restaurantId: "taste-hub",
                    items: [
                        { name: "Margherita Pizza", price: 350, isVeg: true },
                        { name: "Veg Supreme Pizza", price: 400, isVeg: true },
                        { name: "Pepperoni Pizza", price: 450, isVeg: false }
                    ]
                },
                {
                    name: "Alcoholic Drinks",
                    bgColor: "#b73e3e",
                    icon: "🍺",
                    restaurantId: "taste-hub",
                    items: [
                        { name: "Beer", price: 200, isVeg: true },
                        { name: "Whiskey", price: 500, isVeg: true },
                        { name: "Vodka", price: 450, isVeg: true },
                        { name: "Rum", price: 350, isVeg: true },
                        { name: "Tequila", price: 600, isVeg: true },
                        { name: "Cocktail", price: 400, isVeg: true }
                    ]
                },
                {
                    name: "Salads",
                    bgColor: "#5b45b0",
                    icon: "🥗",
                    restaurantId: "taste-hub",
                    items: [
                        { name: "Caesar Salad", price: 200, isVeg: true },
                        { name: "Greek Salad", price: 250, isVeg: true },
                        { name: "Fruit Salad", price: 150, isVeg: true },
                        { name: "Chicken Salad", price: 300, isVeg: false },
                        { name: "Tuna Salad", price: 350, isVeg: true }
                    ]
                }
            ];

            await MenuCategory.insertMany(defaultCategories);
            console.log("Database seeded with default menu categories.");
        }
    } catch (err) {
        console.error("Error seeding menu categories:", err);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(config.databaseURI);
        await seedDemoUsers();
        await seedMenuCategories();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;