import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import UploadRoute from "./Routes/UploadRoute.js";
import NotificationRoute from "./Routes/NotificationRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";

// Load environment variables
dotenv.config();

// Create Express App
const app = express();

// Database Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Let Vercel handle the error and log it
  }
};

// Connect to MongoDB before handling requests
connectDB().catch((error) => {
  console.error("Failed to start server due to MongoDB connection error:", error);
});

// CORS Middleware
app.use(
  cors({
    origin: ["https://ruet-social-web.vercel.app", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Debug allowed origins
console.log("Allowed origins:", ["https://ruet-social-web.vercel.app", "http://127.0.0.1:5173"]);

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/upload", UploadRoute);
app.use("/notifications", NotificationRoute);
app.use("/chat", ChatRoute);

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome !");
});

// Only start the server in development mode
// In production (Vercel), we just export the app
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Handle unhandled promise rejections without closing server in production
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});

// Export the Express app for Vercel
export default app;
