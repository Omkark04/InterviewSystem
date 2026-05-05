import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";  //antigravity
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_SECRET_KEY;

if (!apiKey || !apiSecret) {
  console.error("STREAM_API_KEY or STREAM_SECRET_KEY is missing");
  process.exit(1);
}

// Stream Chat client
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// Stream Video client
export const streamClient = new StreamClient(apiKey, apiSecret);  //antigravity

// Create / Update Stream user
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers([userData]);

    console.log("✅ Stream user upserted:", userData.id);

    return userData;
  } catch (error) {
    console.error("❌ Error upserting Stream user:", error.message);

    return null;
  }
};

// Delete Stream user
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUsers([userId], {
      hard_delete: true,
    });

    console.log("🗑️ Stream user deleted:", userId);

    return true;
  } catch (error) {
    console.error("❌ Error deleting Stream user:", error.message);

    return false;
  }
};