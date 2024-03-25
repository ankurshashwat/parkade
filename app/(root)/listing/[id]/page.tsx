import Review from "@/components/forms/Review";
import AllReviews from "@/components/shared/AllReviews";
import Checkout from "@/components/shared/Checkout";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import Metric from "@/components/shared/Metric";
import Votes from "@/components/shared/Votes";
import { getListingById } from "@/lib/actions/listing.action";
import { getUserById } from "@/lib/actions/user.action";
import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import type { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
  const listing = await getListingById({ listingId: params.id });

  return {
    title: `"${listing.location.coordinates.latitude} , ${listing.location.coordinates.longitude}" - Parkade`,
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  } else {
    return redirect("/sign-in");
  }

  const result = await getListingById({ listingId: params.id });
  if (!result) return null;

  const showActionButtons = clerkId && clerkId === result?.owner.clerkId;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.owner.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.owner.picture}
              alt="profile"
              className="rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.owner.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Listing"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.location.address}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="mb-8 mt-5 flex flex-row flex-wrap items-center gap-4">
          <Metric
            imgUrl="/assets/icons/clock-2.svg"
            alt="clock icon"
            value={` listed ${getTimestamp(result.createdAt)}`}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Review"
            value={getFormattedNumber(result.reviews.length)}
            title=" reviews"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
        <Checkout />
      </div>

      {/* images of the property */}

      <div className="mt-8 flex flex-row items-center justify-between">
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction
              type="Listing"
              itemId={JSON.stringify(result._id)}
            />
          )}
        </SignedIn>
      </div>

      <AllReviews
        listingId={result._id}
        userId={mongoUser._id}
        totalReviews={result.reviews.length}
        filter={searchParams?.filter}
        page={searchParams?.page ? +searchParams.page : 1}
      />

      <Review
        type="Create"
        listingId={JSON.stringify(result._id)}
        userId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default Page;
