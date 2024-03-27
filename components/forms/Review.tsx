"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { createReview, updateReview } from "@/lib/actions/review.action";
import { ReviewSchema } from "@/lib/validation";
import { ListingId } from "@/types/shared";
import { Textarea } from "../ui/textarea";

interface Props extends ListingId {
  type?: string;
  listingId: string;
  userId: string;
  reviewData?: string;
}

const Review = ({ type, listingId, userId, reviewData }: Props) => {
  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const parsedReviewData = reviewData && JSON.parse(reviewData);

  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      review: parsedReviewData?.review || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ReviewSchema>) {
    setIsSubmitting(true);

    try {
      if (type === "Edit") {
        await updateReview({
          review: values.review,
          reviewId: parsedReviewData._id,
          path: `/listing/${JSON.parse(listingId)}#${parsedReviewData._id}}`,
        });
      } else {
        await createReview({
          review: values.review,
          listingId: JSON.parse(listingId),
          author: JSON.parse(userId),
          path: pathname,
        });
      }

      form.reset();
    } catch (error) {
      toast({
        title: `Error ${type === "Edit" ? "editing" : "submitting"} review ⚠️`,
        variant: "destructive",
      });

      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);

      toast({
        title: `Review ${
          type === "Edit" ? "updated" : "submitted"
        } successfully 🎉`,
        variant: "default",
      });
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        {type === "Create" && (
          <h4 className="paragraph-semibold text-dark400_light800">
            Leave you review here
          </h4>
        )}
      </div>

      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Textarea
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Share your experience. Leave a helpful review for this parking
                  spot. Please keep it respectful and avoid vulgar language.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-start">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>{type === "Edit" ? "Updating..." : "Submitting..."}</>
              ) : (
                <>{type === "Edit" ? "Update" : "Submit"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Review;
