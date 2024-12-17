import mongoose, { Schema, Document, Types } from "mongoose";

// Review Document Interface
interface IReview extends Document {
  user: Types.ObjectId;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

// Defining Review Schema
const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String },
    images: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
