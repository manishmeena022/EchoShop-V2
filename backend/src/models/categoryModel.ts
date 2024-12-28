import mongoose, { Schema, Document, Types } from "mongoose";

// Category Document Interface
interface CategoryDocument extends Document {
    name: String;
    slug: String;
    description?: String;
    image?: String;
}

// Defining Category Schema
const categorySchema = new Schema<CategoryDocument>(
    {
        name: { type: String, required: true, unique: true, maxlength: 150 },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        image: { type: String },
    },
    { timestamps: true }
);

// Creating Category Model
const Category = mongoose.model("Category", categorySchema);

export default Category;
