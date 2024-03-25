"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { toast } from "@/components/ui/use-toast";

import { downvoteListing, upvoteListing } from "@/lib/actions/listing.action";
import { downvoteReview, upvoteReview } from "@/lib/actions/review.action";
import { toggleSaveListing } from "@/lib/actions/user.action";
import { getFormattedNumber } from "@/lib/utils";
import { UserId, Voting } from "@/types/shared";

interface Props extends UserId, Voting {
  type: string;
  itemId: string;
  upvotes: number;
  downvotes: number;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();

  const handleSave = async () => {
    await toggleSaveListing({
      userId: JSON.parse(userId),
      listingId: JSON.parse(itemId),
      path: pathname,
    });

    toast({
      title: `Listing ${!hasSaved ? "saved" : "removed from your saved"} 🎉`,
      variant: !hasSaved ? "default" : "destructive",
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: "Not signed in",
        description: "You need to be signed in to vote ⚠️",
      });
    }

    if (action === "upvote") {
      if (type === "Listing") {
        await upvoteListing({
          listingId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "Review") {
        await upvoteReview({
          reviewId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }

      toast({
        title: `Upvote ${!hasupVoted ? "added" : "removed"} 🎉`,
        variant: !hasupVoted ? "default" : "destructive",
      });
    }

    if (action === "downvote") {
      if (type === "Listing") {
        await downvoteListing({
          listingId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "Review") {
        await downvoteReview({
          reviewId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }

      toast({
        title: `Downvote ${!hasdownVoted ? "added" : "removed"} 🎉`,
        variant: !hasdownVoted ? "default" : "destructive",
      });
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {getFormattedNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {getFormattedNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Listing" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
