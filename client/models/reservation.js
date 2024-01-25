import { Schema, model, models } from "mongoose";

const ReservationSchema = new Schema({
  renter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parking: {
    type: Schema.Types.ObjectId,
    ref: "Parking",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  txHash: {
    type: String,
  }
});

const Reservation =
  models.Reservation || model("Reservation", ReservationSchema);

export default Reservation;
