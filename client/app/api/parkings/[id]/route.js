import { connectMongoDB } from "@utils/database";
import Parking from "@models/parking";

export const GET = async (request, { params }) => {
  try {
    await connectMongoDB();
    const parking = await Parking.find({
      owner: params.id,
    });

    if (!parking) {
      return new Response("no parking found", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(parking), {
      status: 200,
    });
  } catch (error) {
    return new Response("internal server error", {
      status: 500,
    });
  }
};
