const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoute");
const ratingRoutes = require("./routes/ratingRoutes");
const workoutSessionRoutes = require("./routes/workoutSessionRoutes");
const friendshipRoutes = require("./routes/friendshipRoutes");
const cors = require("cors");
const path = require("path");
// Define a basic route
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/admin/exercises", exerciseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/workout-sessions", workoutSessionRoutes);
app.use("/api/friendships", friendshipRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
