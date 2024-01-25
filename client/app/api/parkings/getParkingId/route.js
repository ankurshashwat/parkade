import { connectMongoDB } from "@utils/database";
import Parking from "@models/parking";
import Reservation from "@models/reservation";

export const POST = async (request) => {
  const { address } = await request.json();
  try {
    await connectMongoDB();
    const parking = await Parking.findOne({
      address: address,
    }).populate("reservations");
    console.log(parking);
    if (!parking) {
      return new Response(
        JSON.stringify({ message: "No Parking Found", success: false }),
        {
          status: 404,
        }
      );
    }
    console.log("Found Parking:", parking);
    return new Response(
      JSON.stringify({ ...parking.toObject(), success: true }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to get Parking Id", { status: 500 });
  }
};
