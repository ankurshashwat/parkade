import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";

import Listings from "@/components/cards/Listings";
import { ListingFilters } from "@/constants";
import { getSavedListings, getUserById } from "@/lib/actions/user.action";
import type { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites — Parkade",
};

export default async function Favorites({ searchParams }: SearchParamsProps) {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  const mongoUser = await getUserById({ userId: clerkId });
  if (!mongoUser) redirect("/sign-in");

  const result = await getSavedListings({
    clerkId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Favorite Listings</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch route="/favorites" />

        <Filter
          filters={ListingFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.listings.length > 0 ? (
          result.listings.map((listing: any) => (
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
          ))
        ) : (
          <NoResult
            title="No Listings Found"
            description="No Listings Found! Be the first to offer your parking space and earn
            incentives."
            link="/rent-parking"
            linkTitle="Rent a parking space"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}
