import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "./config.js";
import User from "../models/userModel.js";

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

const connectDB = async () => {
    try {
        await mongoose.connect(config.databaseURI);
        await seedDemoUsers();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;