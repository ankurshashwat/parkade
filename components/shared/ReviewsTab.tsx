import Pagination from "@/components/shared/Pagination";
import { getUserReviews } from "@/lib/actions/user.action";
import type { SearchParamsProps } from "@/types";
import { UserId } from "@/types/shared";
import Answers from "../cards/Answers";

interface Props extends SearchParamsProps, UserId {
  clerkId?: string | null;
}
const ReviewsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserReviews({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.reviews.map((review: any) => (
        <Answers
          key={review._id}
          clerkId={clerkId}
          _id={review._id}
          listing={review.listing}
          owner={review.owner}
          upvotes={review.upvotes.length}
          createdAt={review.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default ReviewsTab;
