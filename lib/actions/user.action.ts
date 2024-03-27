"use server";

import Listing from "@/models/listing";
import Review from "@/models/review";
import User from "@/models/user";
import {
  CreateUserParams,
  DeleteUserParams,
  GetSavedListingParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveListingParams,
  UpdateUserParams,
} from "@/types/shared";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function getUserById(params: { userId: string }) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({
      clerkId: userId,
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("No user with this ID found.");
    }

    await Listing.deleteMany({ owner: user._id });
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveListing(params: ToggleSaveListingParams) {
  try {
    connectToDatabase();

    const { userId, listingId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("The user does not exist");
    }

    const isListingSaved = user.saved.includes(listingId);

    if (isListingSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: listingId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: listingId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedListings(params: GetSavedListingParams) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Listing> = {};

    if (searchQuery) {
      query.$or = [{ title: { $regex: new RegExp(searchQuery, "i") } }];
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

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "owner", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedListings = user.saved;

    const isNext = user.saved.length > pageSize;

    return { listings: savedListings, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserListings(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalListings = await Listing.countDocuments({
      owner: userId,
    });

    const skipAmount = (page - 1) * pageSize;

    const userListings = await Listing.find({ owner: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("owner", "_id clerkId name picture");

    const isNext = totalListings > skipAmount + userListings.length;

    return { totalListings, listings: userListings, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserReviews(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalReviews = await Review.countDocuments({
      author: userId,
    });

    const skipAmount = (page - 1) * pageSize;

    const userReviews = await Review.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("listing", "_id")
      .populate("author", "_id clerkId name picture");

    const isNext = totalReviews > skipAmount + userReviews.length;

    return { totalReviews, reviews: userReviews, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalListings = await Listing.countDocuments({ owner: user._id });
    const totalReviews = await Review.countDocuments({ author: user._id });

    const [listingUpvotes] = await Listing.aggregate([
      { $match: { owner: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [ReviewUpvotes] = await Review.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    return {
      user,
      totalListings,
      totalReviews,
      listingUpvotes: listingUpvotes?.[0]?.totalUpvotes || 0,
      reviewUpvotes: ReviewUpvotes?.[0]?.totalUpvotes || 0,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
