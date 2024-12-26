import mongoose, { Schema, Document, Types } from "mongoose";

interface IBrand extends Document {
    name: string;
    image: string;
    description: string;
    website: string;
    isFeatured: boolean;
}

const brandSchema = new Schema<IBrand>(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        website: { type: String },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;
