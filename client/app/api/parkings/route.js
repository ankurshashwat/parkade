import { connectMongoDB } from "@utils/database";
import Parking from "@models/parking";

export const GET = async (request) => {
  try {
    await connectMongoDB();
    const parking = await Parking.find({}).populate("owner");

    return new Response(JSON.stringify(parking), {
      status: 200,
    });
  } catch (error) {
    return new Response("no parking not found", {
      status: 500,
    });
  }
};
