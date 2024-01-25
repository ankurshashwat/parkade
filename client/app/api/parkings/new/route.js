import { connectMongoDB } from "@utils/database";
import Parking from "@models/parking";

export const POST = async (request) => {
  try {
    const { owner, wallet, address, hourlyRate } = await request.json();
    if (!owner || !wallet || !address || !hourlyRate) {
      return new Response("missing or invalid data", {
        status: 400,
      });
    }

    await connectMongoDB();
    const newParking = new Parking({
      owner: owner,
      wallet,
      address,
      hourlyRate,
    });

    await newParking.save();

    // Return a success response with the newly created Parking details
    return new Response(
      JSON.stringify({ ...newParking.toObject(), success: true }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response("failed to list a new parking", {
      status: 500,
    });
  }
};
