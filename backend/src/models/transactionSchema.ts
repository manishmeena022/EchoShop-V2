import mongoose, { Schema, Document, Types } from "mongoose";

// Transaction Document Interface
interface ITransaction extends Document {
    user: Types.ObjectId;
    order: Types.ObjectId;
    paymentMethod: string;
    paymentResult: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    amount: number;
    isPaid: boolean;
    paidAt: Date;
}

// Defining Transaction Schema
const transactionSchema = new Schema<ITransaction>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    paymentMethod: { type: String, required: true },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
});

const Transaction = mongoose.model<ITransaction>(
    "Transaction",
    transactionSchema
);

export default Transaction;
