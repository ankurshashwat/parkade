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

interface OptionalPage {
  page?: number;
}

interface OptionalPageSize {
  pageSize?: number;
}

interface OptionalSearch {
  searchQuery?: string;
}

interface OptionalFilter {
  filter?: string;
}

interface Voting {
  hasupVoted: boolean;
  hasdownVoted: boolean;
}

interface Searchable
  extends OptionalPage,
    OptionalPageSize,
    OptionalSearch,
    OptionalFilter {}

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

export interface ToggleSaveListingParams extends UserId, ListingId, Path {}

export interface GetSavedListingParams
  extends ClerkId,
    OptionalPage,
    OptionalPageSize,
    OptionalSearch,
    OptionalFilter {}

export interface GetUserStatsParams
  extends UserId,
    OptionalPage,
    OptionalPageSize {}
