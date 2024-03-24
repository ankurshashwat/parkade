"use server";

import User from "@/models/user";
import Listing from "@/models/listing";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function getUserById(params: { userId: string }) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({
      clerkId: userId,
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const {clerkId} = params;

    const user = await User.findOneAndDelete({ clerkId });

    if(!user){
      throw new Error("No user with this ID found.");
    }
    
    await Listing.deleteMany({owner: user._id});
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;

  } catch (error) {
    console.log(error); 
    throw error;
  }
}