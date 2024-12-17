import mongoose, { Schema, Document, Types } from "mongoose";

interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  category: Types.ObjectId[];
  brand?: string;
  image: string[];
  specification: {
    key: string;
    value: string;
  }[];
  reviews: Types.ObjectId[];
  averageRating: number;
  totalRating: number;
  isFeatured: boolean;
  isAvailable: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  dimensions?: {
    width?: number;
    height?: number;
    weight?: number;
    length?: number;
  };
  tags: string[];
  relatedProducts: Types.ObjectId[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, unique: true },
    category: [{ type: Types.ObjectId, ref: "Category" }],
    brand: { type: String },
    image: [{ type: String, required: true }],
    specification: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    reviews: [{ type: Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      metaKeywords: [{ type: String }],
    },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
      weight: { type: Number },
      length: { type: Number },
    },
    tags: [{ type: String }],
    relatedProducts: [{ type: Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
