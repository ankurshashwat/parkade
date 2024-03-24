import { Schema, models, model, Document } from "mongoose";

export interface ListingInterface extends Document {
  owner: Schema.Types.ObjectId;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  amount: number;
  availability: {
    startDate: Date;
    endDate: Date;
  };
  reviews: Schema.Types.ObjectId[];
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const ListingSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  location: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  images: { type: [String], required: true },
  amount: { type: Number, required: true },
  availability: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Listing = models.Listing || model("Listing", ListingSchema);

export default Listing;
