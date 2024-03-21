"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
import { createListing, updateListing } from "@/lib/actions/listing.action";
import { listingSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";
import Map, { MapProps } from "../Map";
import { uploadImagesToS3 } from "@/lib/s3";

interface Props {
  type: string;
  mongoUserId: string;
  listingDetails?: string;
}

const ListParking = ({ type, mongoUserId, listingDetails }: Props) => {
  const router = useRouter();
  // const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [images, setImages] = useState<FileList | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [address, setAddress] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const updateAddress: MapProps["updateAddress"] = (newAddress: any) => {
    setAddress(newAddress);
  };

  const parsedListingDetails =
    listingDetails && JSON.parse(listingDetails || "");

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      ownerId: parsedListingDetails?.ownerId || mongoUserId,
      location: {
        address: parsedListingDetails?.location?.address || "",
        coordinates: {
          latitude: parsedListingDetails?.location?.coordinates?.latitude || 0.00,
          longitude:
            parsedListingDetails?.location?.coordinates?.longitude || 0.00,
        },
      },
      images: parsedListingDetails?.images || [],
      amount: parsedListingDetails?.amount || 100,
      availability: {
        startDate: parsedListingDetails?.availability?.startDate || new Date(),
        endDate:
          parsedListingDetails?.availability?.endDate ||
          new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  async function onSubmit(values: z.infer<typeof listingSchema>) {
    console.table(values);
    setIsSubmitting(true);
  
    try {
      if (type === "Edit") {
        await updateListing({
          listingId: parsedListingDetails._id,
          ownerId: parsedListingDetails.ownerId,
          location: {
            address: parsedListingDetails.location.address,
            coordinates: {
              latitude: parsedListingDetails.location.coordinates.latitude,
              longitude: parsedListingDetails.location.coordinates.longitude,
            },
          },
          images: values.images,
          amount: values.amount,
          availability: {
            startDate: values.availability.startDate,
            endDate: values.availability.endDate,
          },
        });
      
        router.push(`/listing/${parsedListingDetails?._id}`);
      } else {
        if (images) {
          const imageUrls = await uploadImagesToS3(images);
          values.images = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
        }
  
        await createListing({
          ownerId: mongoUserId,
          location: {
            address: values.location.address,
            coordinates: {
              latitude: values.location.coordinates.latitude,
              longitude: values.location.coordinates.longitude,
            },
          },
          images: values.images,
          amount: values.amount,
          availability: {
            startDate: values.availability.startDate,
            endDate: values.availability.endDate,
          },
          averageRating: 0,
        });
        router.push("/"); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Map updateAddress={updateAddress} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="location.address"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Address <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Specific address of your parking space.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location.coordinates.latitude"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Latitude <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Latitude coordinates of your parking space.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location.coordinates.longitude"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Longitude <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Longitude coordinates of your parking space.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability.startDate"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  From <span className="text-primary-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="text-dark400_light800 mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Choose the start date when your parking space is available.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability.endDate"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  To <span className="text-primary-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="text-dark400_light800 mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date <= new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Choose the end date until your parking space is available.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Amount <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    type="number"
                    step="any"
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Specify the rental amount for your parking spot.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Photos <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    multiple
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border border-dashed p-4"
                    {...field}
                    value={field.value || []}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Upload photos of your parking space for reference.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>{type === "Edit" ? "Updating..." : "Listing..."}</>
            ) : (
              <>{type === "Edit" ? "Update parking" : "List your parking"}</>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ListParking;
