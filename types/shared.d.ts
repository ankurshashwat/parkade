/* eslint-disable no-unused-vars */
import { Schema } from "mongoose";

import { UserInterface } from "@/models/user";

/* common interface used in actions */

interface ClerkId {
  clerkId: string;
}

interface Path {
  path: string;
}

interface UserId {
  userId: string;
}

interface ListingId {
  listingId: string;
}

/* interfaces for user actions */

export interface CreateUserParams extends ClerkId {
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface UpdateUserParams extends ClerkId, Path {
  updateData: Partial<UserInterface>;
}

export interface DeleteUserParams extends ClerkId {}

export interface GetUserByIdParams extends UserId {}