import mongoose, { Schema, Document, Types } from "mongoose";

// Coupon Document Interface
interface ICoupon extends Document {
    code: string;
    discount: number;
    isActive: boolean;
    expiresAt: Date;
}

// Defining Coupon Schema
const couponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            minlength: [6, "Coupon must be up to 6 characters"],
            maxlength: [12, "Coupon must not be more than 12 characters"],
        },
        discount: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
        expiresAt: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

// Creating Coupon Model
const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;
