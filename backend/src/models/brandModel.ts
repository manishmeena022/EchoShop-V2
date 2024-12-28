import mongoose, { Schema, Document, Types } from "mongoose";

// Brand Document Interface
interface IBrand extends Document {
    name: string;
    image: string;
    description: string;
    website: string;
    isFeatured: boolean;
}

// Defining Brand Schema
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

// Creating Brand Model
const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;
