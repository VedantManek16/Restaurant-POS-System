import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
            },
            message: "Email must be in a valid format!"
        }
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: ["Super Admin", "Restaurant Admin", "Cashier", "Waiter", "Kitchen Staff"]
    },
    tenantId: {
        type: String,
        required: [true, "Tenant ID is required"],
        trim: true
    },
    tenantName: {
        type: String,
        required: [true, "Tenant Name is required"],
        trim: true
    }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);