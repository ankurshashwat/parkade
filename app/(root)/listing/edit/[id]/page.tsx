import ListParking from "@/components/forms/ListParking";
import { getListingById } from "@/lib/actions/listing.action";
import { getUserById } from "@/lib/actions/user.action";
import type { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Listing — Parkade",
};

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  if (!mongoUser) redirect("/sign-in");

  const result = await getListingById({ listingId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Update Listing</h1>
      <div className="mt-9">
        <ListParking
          type="Edit"
          mongoUserId={mongoUser._id}
          listingDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
