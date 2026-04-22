import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

const app = express();

const __dirname = path.resolve();

console.log(ENV.PORT);
console.log(ENV.DB_URL);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up nd running" });
});

app.get("/books", (req, res) => {
  res.status(200).json({ msg: "books api endpoint" });
});

//make app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () =>
      console.log("server is running on port :", ENV.PORT)
    );
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
