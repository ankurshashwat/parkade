import { Schema, models, model, Document } from "mongoose";

export interface ReviewInterface extends Document {
  userId: Schema.Types.ObjectId;
  listingId: Schema.Types.ObjectId;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  review: string;
  createdAt: Date;
}

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  listingId: { type: Schema.Types.ObjectId, required: true, ref: "Listing" },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }], 
  review: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

const Review = models.Review || model("Review", ReviewSchema);

export default Review;
