import { getAuth, createClerkClient } from "@clerk/express";
import User from "../models/User.js";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const protectRoute = async (req, res, next) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - no valid session" });
    }

    // Find user in DB, or auto-create if first local login (webhook not set up locally)
    let user = await User.findOne({ clerkId });

    if (!user) {
      // Fetch user details from Clerk and upsert into MongoDB
      const clerkUser = await clerk.users.getUser(clerkId);
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User";
      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      const profileImage = clerkUser.imageUrl || "";

      user = await User.findOneAndUpdate(
        { clerkId },
        { $setOnInsert: { clerkId, name, email, profileImage } },
        { upsert: true, new: true }
      );

      console.log("[protectRoute] Auto-created user in DB:", email);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[protectRoute] Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};