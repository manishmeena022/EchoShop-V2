import mongoose, { Schema, Document, Types } from "mongoose";

interface CategoryDocument extends Document {
  name: String;
  slug: String;
  description?: String;
  image?: String;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
