"use server";

import Listing from "@/models/listing";
import Review from "@/models/review";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "../mongoose";

export async function createReview(params: any) {
  try {
    connectToDatabase();

    const { review, userId, listingId, path } = params;

    const newReview = await Review.create({
      review,
      author: userId,
      listing: listingId,
      path,
    });

    // eslint-disable-next-line no-unused-vars
    const listingObj = await Listing.findByIdAndUpdate(listingId, {
      $push: { reviews: newReview._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateReview(params: any) {
  try {
    connectToDatabase();

    const { reviewId, review, path } = params;

    const newReview = await Review.findById(reviewId);

    if (!newReview) {
      throw new Error("No review provided");
    }

    newReview.review = review;

    await newReview.save();

    redirect(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteReview(params: any) {
  try {
    connectToDatabase();

    const { reviewId, path } = params;
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("The review does not exist");
    }

    await review.deleteOne({ _id: reviewId });

    await Listing.updateMany(
      { _id: review.listing },
      { $pull: { reviews: reviewId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getReviews(params: any) {
  try {
    connectToDatabase();

    const { listingId, page = 1, pageSize = 10, sortBy } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      default:
        break;
    }

    const reviews = await Review.find({ listing: listingId })
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalReviews = await Review.countDocuments({ listing: listingId });

    const isNext = totalReviews > skipAmount + reviews.length;

    return { reviews, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getReviewById(params: any) {
  try {
    connectToDatabase();

    const { reviewId } = params;

    const review = await Review.findById(reviewId).populate(
      "author",
      "_id clerkId name picture"
    );

    return review;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteReview(params: any) {
  try {
    connectToDatabase();

    const { reviewId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const review = await Review.findByIdAndUpdate(reviewId, updateQuery, {
      new: true,
    });

    if (!review) {
      throw new Error("No review provided");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteReview(params: any) {
  try {
    connectToDatabase();

    const { reviewId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const review = await Review.findByIdAndUpdate(reviewId, updateQuery, {
      new: true,
    });

    if (!review) {
      throw new Error("No review provided");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
