import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

// create inngest client
export const inngest = new Inngest({ id: "interview-platform" });

// CREATE / SYNC USER
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        profileImage: image_url || "",
      },
      { upsert: true, new: true }
    );

    console.log("✅ User synced:", id);
  }
);

// DELETE USER
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.deleteOne({ clerkId: id });

    console.log("🗑️ User deleted:", id);
  }
);

// export functions
export const functions = [syncUser, deleteUserFromDB];