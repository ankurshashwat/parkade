import { Schema, models, model, Document } from "mongoose";

export interface UserInterface extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  picture: string;
  location?: string;
  listings: Schema.Types.ObjectId[];
  bookings: Schema.Types.ObjectId[];
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  picture: { type: String, required: true },
  location: { type: String },
  listings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  saved: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  joinedAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);

export default User;
