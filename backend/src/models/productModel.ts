import mongoose, { Schema, Document, Types } from "mongoose";

// Prdocut Document Interface

interface IProduct extends Document {
    name: string;
    slug: string;
    price: number;
    salePrice: number;
    discount: number;
    quantity: number;
    description: string;
    images: string[];
    category: Types.ObjectId;
    brand: Types.ObjectId;
    isFeatured: boolean;
    isActive: boolean;
}

// Defining Product Schema
const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        discount: { type: Number },
        quantity: { type: Number, required: true },
        description: { type: String, required: true },
        images: [{ type: String }],
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Creating Product Model
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
