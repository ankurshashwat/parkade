import { connectMongoDB } from "@utils/database";
import Parking from "@models/parking";
import Reservation from "@models/reservation";

export const GET = async (request, { params }) => {
  try {
    await connectMongoDB();
    const parkingId = params.id;

    const parking = await Parking.findById(parkingId)
      .populate("reservations")
      .exec();
    return new Response(JSON.stringify(parking), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("failed to get parking Id", {
      status: 500,
    });
  }
};
