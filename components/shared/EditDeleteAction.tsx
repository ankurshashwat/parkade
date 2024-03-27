"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteListing } from "@/lib/actions/listing.action";
import { deleteReview } from "@/lib/actions/review.action";


interface Props {
  type: string;
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    if (type === "Listing") {
      router.push(`/listing/edit/${JSON.parse(itemId)}`);
    } else if (type === "Review") {
      router.push(`/edit-review/${JSON.parse(itemId)}`);
    }
  };

  const handleDelete = async () => {
    if (type === "Listing") {
      await deleteListing({
        listingId: JSON.parse(itemId),
        path: pathname,
        isListingPath: pathname === `/listing/${JSON.parse(itemId)}`,
      });
    } else if (type === "Review") {
        await deleteReview({ reviewId: JSON.parse(itemId), path: pathname });
      console.log("review deleted");
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      <Image
        src="/assets/icons/edit.svg"
        alt="Edit"
        width={14}
        height={14}
        className="cursor-pointer"
        onClick={handleEdit}
      />

      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
