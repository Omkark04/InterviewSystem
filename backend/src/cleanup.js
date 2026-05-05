// One-time cleanup script - run once with: node src/cleanup.js
// Drops stale clerkID index and null user documents

import mongoose from "mongoose";
import { ENV } from "./lib/env.js";

await mongoose.connect(ENV.DB_URL);
console.log("Connected to MongoDB");

const db = mongoose.connection.db;
const collection = db.collection("users");

// 1. Remove any documents where clerkId / clerkID is null or missing
const deleted = await collection.deleteMany({
  $or: [{ clerkId: null }, { clerkID: null }, { clerkId: { $exists: false } }],
});
console.log(`Deleted ${deleted.deletedCount} null/invalid user documents`);

// 2. Drop the stale clerkID_1 index (capital D) if it exists
const indexes = await collection.indexes();
console.log("Current indexes:", indexes.map((i) => i.name));

const staleIndex = indexes.find((i) => i.name === "clerkID_1");
if (staleIndex) {
  await collection.dropIndex("clerkID_1");
  console.log("Dropped stale index: clerkID_1");
} else {
  console.log("Stale index clerkID_1 not found (already clean)");
}

await mongoose.disconnect();
console.log("Done. You can delete this file now.");
