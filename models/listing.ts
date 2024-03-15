import { Schema, models, model, Document } from "mongoose";

export interface ListingInterface extends Document {
  ownerId: Schema.Types.ObjectId;
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
  ratings: Schema.Types.ObjectId[];
  averageRating: number;
}

const ListingSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
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
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  averageRating: { type: Number },
});

const Listing = models.Listing || model("Listing", ListingSchema);

export default Listing;
