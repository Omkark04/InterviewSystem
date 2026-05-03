import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

// Stream client
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// Create / Update Stream user
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers([userData]);
    console.log(" Stream user upserted:", userData.id);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error.message);
    throw error;
  }
};

// Delete Stream user
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUsers([userId], {
      hard_delete: true,
    });

    console.log(" Stream user deleted:", userId);
    return true;
  } catch (error) {
    console.error("Error deleting Stream user:", error.message);
    throw error;
  }
};