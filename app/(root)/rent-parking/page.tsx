import React from "react";
import { auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import type { SearchParamsProps } from "@/types";

import { getAllListings } from "@/lib/actions/listing.action";
import Link from "next/link";
import { ListingFilters } from "@/constants";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/shared/Filter";
import Listings from "@/components/cards/Listings";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent Parking - Parkade",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { userId: clerkId } = auth();

  const result = await getAllListings({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Listings</h1>

        <Link href="/list-parking" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            List Parking
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch route="/" />

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
            link="/list-parking"
            linkTitle="List Your Parking Spot Now!"
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
};

export default Page;
