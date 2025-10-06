// File: models/Order.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";   // ✅ Import IUser for type safety
interface IOrderItem {
  productId: mongoose.Types.ObjectId; // can later be populated with IProduct
  variantId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // price at time of order
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;   // ✅ fix _id being 'unknown'
  userId: mongoose.Types.ObjectId | IUser; // ✅ can be populated User
  items: IOrderItem[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  paymentMethod?: "cod" | "online";
  paymentStatus?: "pending" | "unpaid" | "paid";
  status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "unpaid", "paid"],
      default: "unpaid",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "failed",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
