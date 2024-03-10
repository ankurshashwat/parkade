import { Schema, models, model, Document } from "mongoose";

export interface RatingInterface extends Document {
  userId: Schema.Types.ObjectId;
  listingId: Schema.Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
}

const RatingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  listingId: { type: Schema.Types.ObjectId, required: true, ref: "Listing" },
  rating: { type: Number, required: true }, 
  review: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

const Rating = models.Rating || model("Rating", RatingSchema);

export default Rating;
