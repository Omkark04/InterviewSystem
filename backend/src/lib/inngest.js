import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

// ✅ THIS LINE WAS MISSING
export const inngest = new Inngest({ id: "interview-platform" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.create({
      clerkId: id,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];