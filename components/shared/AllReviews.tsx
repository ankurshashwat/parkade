import { ReviewFilters } from "@/constants";
import { getReviews } from "@/lib/actions/review.action";
import { getTimestamp } from "@/lib/utils";
import {
    ListingId,
    OptionalFilter,
    OptionalPage,
    UserId,
} from "@/types/shared";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import EditDeleteAction from "./EditDeleteAction";
import Filter from "./Filter";
import Pagination from "./Pagination";
import Votes from "./Votes";

interface Props extends ListingId, UserId, OptionalPage, OptionalFilter {
  totalReviews: number;
}

const AllReviews = async ({
  userId,
  listingId,
  totalReviews,
  filter,
  page,
}: Props) => {
  const result = await getReviews({
    listingId,
    sortBy: filter,
    page,
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalReviews} Reviews</h3>
        <Filter filters={ReviewFilters} />
      </div>
      <div>
        {result.reviews.map((review: any) => {
          const showActionButtons =
            JSON.stringify(userId) === JSON.stringify(review.author._id);

          return (
            <article key={review._id} className="light-border border-b py-10">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${review.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={review.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {review.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      <span className="max-sm:hidden">• reviewed </span>
                      {getTimestamp(review.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Votes
                    type="Review"
                    itemId={JSON.stringify(review._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={review.upvotes.length}
                    hasupVoted={review.upvotes.includes(userId)}
                    downvotes={review.downvotes.length}
                    hasdownVoted={review.downvotes.includes(userId)}
                  />
                </div>
              </div>
              {/* <ParseHTML data={review.content} /> */}

              <SignedIn>
                {showActionButtons && (
                  <EditDeleteAction
                    type="Review"
                    itemId={JSON.stringify(review._id)}
                  />
                )}
              </SignedIn>
            </article>
          );
        })}
      </div>

      <div className="mt-10 w-full">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllReviews;
