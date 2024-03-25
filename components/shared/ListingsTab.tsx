import Pagination from "@/components/shared/Pagination";
import { getUserListings } from "@/lib/actions/user.action";
import type { SearchParamsProps } from "@/types";
import { UserId } from "@/types/shared";
import Listings from "../cards/Listings";

interface Props extends SearchParamsProps, UserId {
  clerkId?: string | null;
}

const ListingsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserListings({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.listings.map((listing) => (
        <Listings
          key={listing._id}
          _id={listing._id}
          owner={listing.owner}
          location={listing.location}
          availability={listing.availability}
          upvotes={listing.upvotes}
          downvotes={listing.downvotes}
          createdAt={listing.createdAt}
          clerkId={clerkId}
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

export default ListingsTab;
