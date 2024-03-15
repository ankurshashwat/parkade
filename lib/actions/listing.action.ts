"use server";

import Listing from "@/models/listing";
import { connectToDatabase } from "../mongoose";

export async function createListing(params: any) {
  try {
    connectToDatabase();

    const { ownerId, location, images, amount, availability, averageRating } =
      params;

    const newListing = await Listing.create({
      owner: ownerId,
      location,
      images,
      amount,
      availability,
      averageRating,
    });

    return newListing._id;
  } catch (error) {
    console.log("error creating listing", error);
  }
}

export async function updateListing(params:any) {
    try {
        connectToDatabase();

        

    } catch (error) {
        console.log('Error updating listing', error);
    }

    
}