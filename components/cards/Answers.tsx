import Link from "next/link";

import { SignedIn } from "@clerk/nextjs";

import EditDeleteAction from "@/components/shared/EditDeleteAction";
import Metric from "@/components/shared/Metric";

import { getFormattedNumber, getTimestamp } from "@/lib/utils";

interface Props {
  clerkId?: string | null;
  _id: string;
  listing: {
    _id: string;
    location: {
      address: string;
    };
  };
  owner: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  createdAt: Date;
}

const Answers = ({
  clerkId,
  _id,
  listing,
  owner,
  upvotes,
  createdAt,
}: Props) => {
  const showActionButtons = clerkId && clerkId === owner.clerkId;

  return (
    <Link
      href={`/listing/${listing._id}/#${_id}`}
      className="card-wrapper rounded-[10px] px-11 py-9"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {listing.location.address}
          </h3>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={owner.picture}
          alt="user avatar"
          value={owner.name}
          title={` • asked ${getTimestamp(createdAt)}`}
          href={`/profile/${owner.clerkId}`}
          textStyles="body-medium text-dark400_light700"
          isOwner
        />

        <div className="flex-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
            value={getFormattedNumber(upvotes)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </Link>
  );
};

export default Answers;
