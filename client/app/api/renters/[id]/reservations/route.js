import { connectMongoDB } from "@utils/database";
import Parking from "@models/parking";
import Reservation from "@models/reservation";

export const GET = async (request, { params }) => {
  try {
    await connectMongoDB();

    const reservations = await Reservation.find({
      renter: params.id,
    }).populate("parking");

    return new Response(JSON.stringify(reservations), {
      status: 200,
    });
  } catch (error) {
    return new Response("no reservations", {
      status: 500,
    });
  }
};

export const POST = async (request) => {                                  //! bad request and missing or invalid data
  const { renter, parking, startTime, endTime, amount, txHash } =
    await request.json();

  if (
    !renter ||
    !parking ||
    !startTime ||
    !endTime ||
    !amount ||
    !txHash
  ) {
    return new Response("missing or invalid data", {
      status: 400,
    });
  }

  try {
    await connectMongoDB();

    const newReservation = new Reservation({
      renter: renter,
      parking: parking,
      startTime: startTime,
      endTime: endTime,
      amount: amount,
      txHash: txHash,
    });

    await newReservation.save();

    await Parking.findByIdAndUpdate(
      parking,
      {
        $push: { reservations: newReservation._id },
      },
      { new: true }
    );

    return new Response(
      JSON.stringify({ ...newReservation.toObject(), success: true }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response("failed to make a new reservation", {
      status: 500,
    });
  }
};
