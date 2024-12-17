import mongoose, { Schema, Document, CallbackError } from "mongoose";
import bcrypt from "bcrypt";

// User Document Interface
interface IUser extends Document {
  name: {
    firstName: string;
    lastName?: string;
  };
  email: string;
  password: string;
  role: "admin" | "customer" | "vendor";
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  profile?: {
    age?: number;
    phone?: string;
    photo?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zip?: string;
    };
  };
  wishList?: mongoose.Types.ObjectId[];
  cart?: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    addedAt: Date;
  }[];
  orders?: {
    orderId: mongoose.Types.ObjectId;
    orderDate: Date;
    totalAmount: number;
    status: "pending" | "shipped" | "delivered" | "cancelled" | "returned";
  }[];
  isModified: (field: string) => boolean;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  fullName: string;
  softDelete: () => Promise<void>;
}

// Defining User schema
const userSchema = new Schema<IUser>(
  {
    name: {
      firstName: { type: String, required: true, maxlength: 50 },
      lastName: { type: String, maxlength: 50 },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: ["admin", "customer", "vendor"],
      default: "customer",
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deletedAt: { type: Date, default: null },
    profile: {
      age: { type: Number, min: 0, max: 120 },
      phone: {
        type: String,
        match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"],
      },
      photo: {
        type: String,
      },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zip: {
          type: String,
          match: [/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"],
        },
      },
    },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, min: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    orders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        orderDate: { type: Date, required: true },
        totalAmount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered", "cancelled", "returned"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

// Virtual field for the user's full name
userSchema.virtual("fullName").get(function () {
  return `${this.name.firstName} ${this.name.lastName || ""}`.trim();
});

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Soft delete helper method
userSchema.methods.softDelete = async function () {
  this.deletedAt = Date.now();
  this.isActive = false;
  await this.save();
};

// Index email for faster queries
userSchema.index({ email: 1 });

// Mongoose model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
