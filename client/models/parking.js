import { Schema, model, models } from "mongoose";

const ParkingSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  wallet: {
    type: String,
    required: true,
  },
  address: {
    type: Object,
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
});
const Parking =
  models.Parking || model("Parking", ParkingSchema);

export default Parking;
