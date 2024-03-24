import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { formatDate, getTimestamp } from "@/lib/utils";
import Metric from "../shared/Metric";
import EditDeleteAction from "../shared/EditDeleteAction";

interface ListingProps {
  _id: string;
  owner: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  upvotes: any;
  downvotes: any;
  availability: {
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  clerkId?: string | null;
}

const Listings = ({
  _id,
  owner,
  location,
  upvotes,
  downvotes,
  availability,
  createdAt,
  clerkId,
}: ListingProps) => {
  const showActionButtons = clerkId && clerkId === owner.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/listing/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {location.address}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Listing" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap items-center gap-3">
        <Metric
          imgUrl={owner.picture}
          alt="user"
          value={owner.name}
          title={` • listed ${getTimestamp(createdAt)}`}
          href={`/profile/${owner._id}`}
          isOwner
          textStyles="body-medium text-dark400_light700"
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="assets/icons/coordinates.svg"
            alt="coordinates"
            value={`${location.coordinates.latitude} , ${location.coordinates.longitude}`}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="assets/icons/calendar.svg"
            alt="availability"
            value={`${formatDate(availability.startDate)} to ${formatDate(
              availability.endDate
            )}`}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="assets/icons/upvote.svg"
            alt="upvotes"
            value={upvotes?.length || 0}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="assets/icons/downvote.svg"
            alt="downvotes"
            value={downvotes?.length || 0}
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default Listings;
