import { z } from "zod";

const locationSchema = z.object({
  address: z.string().trim().min(1, "Address is required"),
  coordinates: z.object({
    latitude: z.preprocess(
      (val) => Number(val),
      z.number().min(-90, "Invalid latitude").max(90, "Invalid latitude")
    ),
    longitude: z.preprocess(
      (val) => Number(val),
      z.number().min(-180, "Invalid longitude").max(180, "Invalid longitude")
    ),
  }),
});

const availabilitySchema = z.object({
  startDate: z.date(),
  endDate: z.date().min(new Date(), "End date must be in the future"),
});

export const listingSchema = z.object({
  owner: z.string().optional(),
  location: locationSchema,
  images: z.array(z.string().url("Invalid image URL")),
  amount: z.number().positive("Amount must be positive"),
  availability: availabilitySchema,
});
