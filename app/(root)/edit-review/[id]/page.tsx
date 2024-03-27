import Review from "@/components/forms/Review";
import { getReviewById } from "@/lib/actions/review.action";
import { getUserById } from "@/lib/actions/user.action";
import type { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Review - Parkade",
};

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  if (!mongoUser) redirect("/sign-in");

  const result = await getReviewById({ reviewId: params.id });

  if (userId !== result.author.clerkId) redirect("/");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Review</h1>
      <div className="mt-9">
        <Review
          type="Edit"
          listingId={JSON.stringify(result.review)}
          userId={JSON.stringify(result.author)}
          reviewData={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
