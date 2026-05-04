import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// health
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is running" });
});

// IMPORTANT: Inngest
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// Chat routes
app.use("/api/chat", chatRoutes);

// start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();