import { Schema, models, model, Document } from "mongoose";

export interface BookingInterface extends Document {
  listingId: Schema.Types.ObjectId;
  renter: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  amount: number;
  paymentId: string;
  createdAt: Date;
}

const BookingSchema = new Schema({
  listingId: { type: Schema.Types.ObjectId, required: true, ref: "Listing" },
  renter: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = models.Booking || model("Booking", BookingSchema);

export default Booking;
