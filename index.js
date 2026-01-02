import "dotenv/config";
import express from "express";
import cors from 'cors';
import { pool } from "./db/pool.js";
import authRoutes from "./routes/auth-route.js";
import userRoutes from "./routes/user-route.js";
import articleRoutes from "./routes/article-route.js";
import articleCommentRoutes from "./routes/article-comment-route.js";
import videoRoutes from "./routes/video-route.js";
import followingRoutes from "./routes/following-route.js";
import followerRoutes from "./routes/follower-route.js";
import channelRoutes from "./routes/channel-route.js";
import subscriberRoutes from "./routes/subscriber-route.js";
import subscriptionRoutes from "./routes/subscription-route.js";
import { authenticateToken } from "./middleware/auth_middleware.js";
import errorHandler from "./middleware/error_middleware.js";



// Create the express server and configure it to use json
const app = express();
app.use(express.json());

// Configure cors policy
app.use(cors())

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/articlecomments", articleCommentRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/following", followingRoutes);
app.use("/api/follower", followerRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/subscriber", subscriberRoutes);

// Protected route example using middleware
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

app.use("/uploads", express.static("uploads"));

// Set up a API call with GET method
app.get('/data', (req, res) => {
  // Return some sample data as the response
  res.json({
    message: 'Hello, world!'
  });
});

app.use(errorHandler);

// Start the server on port configured in .env (recommend port 8000)
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // sanity check DB connectivity
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to PostgreSQL", err);
    process.exit(1);
  }
};

startServer();