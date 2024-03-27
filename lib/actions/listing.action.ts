"use server";

import Listing from "@/models/listing";
import Review from "@/models/review";
import User from "@/models/user";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "../mongoose";

export async function createListing(params: any) {
  try {
    connectToDatabase();

    const {
      owner,
      location,
      images,
      amount,
      availability,
      upvotes,
      downvotes,
      path,
    } = params;

    const newListing = await Listing.create({
      owner,
      location,
      images,
      amount,
      availability,
      upvotes,
      downvotes,
    });
    console.log(newListing);
    revalidatePath(path);
    return newListing._id;
  } catch (error) {
    console.log("error creating listing", error);
  }
}

export async function updateListing(params: any) {
  try {
    connectToDatabase();

    const { listingId, images, amount, availability, path } = params;

    const listing = await Listing.findById(listingId);

    if (!listing) throw new Error(`No listing found with id ${listingId}`);

    listing.images = images || listing.images;
    listing.amount = amount || listing.amount;
    listing.availability = availability || listing.availability;

    await listing.save();
    revalidatePath(path);
  } catch (error) {
    console.log("Error updating listing", error);
  }
}

export async function deleteListing(params: any) {
  try {
    connectToDatabase();

    const { listingId, path, isListingPath = false } = params;

    const listing = await Listing.findById({ _id: listingId });

    if (!listing) throw new Error("No listing was found");

    await Listing.deleteOne({ _id: listingId });

    await Review.deleteMany({ listingID: listingId });

    if (isListingPath) {
      redirect("/");
    } else {
      revalidatePath(path);
    }
  } catch (error) {
    console.log("Error deleting listing", error);
    throw error;
  }
}

export async function getAllListings(params: any) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 10, filter, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Listing> = {};

    if (searchQuery) {
      query.$or = [
        {
          address: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "reviews":
        sortOptions = { upvotes: -1 };
        break;
      default:
        break;
    }

    const listings = await Listing.find(query)
      .populate({ path: "owner", model: User })
      .populate({ path: "reviews", model: Review })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const allListings = await Listing.countDocuments(query);
    const isNext = allListings > skipAmount + listings.length;
    return { listings, isNext };
  } catch (error) {
    console.log("Error getting all listings");
    throw error;
  }
}

export async function getListingById(params: any) {
  try {
    connectToDatabase();

    const { listingId } = params;

    const listing = await Listing.findById(listingId).populate({
      path: "owner",
      model: User,
      select: "_id clerkId name picture",
    });
    return listing;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteListing(params: any) {
  try {
    connectToDatabase();

    // eslint-disable-next-line no-unused-vars
    const { listingId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const listing = await Listing.findOneAndUpdate(listingId, updateQuery, {
      new: true,
    });

    if (!listing) {
      throw new Error("The listing does not exist.");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteListing(params: any) {
  try {
    connectToDatabase();

    // eslint-disable-next-line no-unused-vars
    const { listingId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const listing = await Listing.findOneAndUpdate(listingId, updateQuery, {
      new: true,
    });

    if (!listing) {
      throw new Error("The listing does not exist.");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
