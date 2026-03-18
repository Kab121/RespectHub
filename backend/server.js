// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./models");

const authRoutes = require("./routes/auth.routes");
const actionRoutes = require("./routes/action.routes");
const adminRoutes = require("./routes/admin.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const chatbotRoutes = require("./routes/chatbot.routes"); // ✅ added

const app = express();

/* ---------------------------
   Middleware
---------------------------- */

// ✅ CORS: allow your frontend(s)
const allowedOrigins = [
  "http://localhost:5173", // Vite
  "http://localhost:3000", // React app
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow Postman / server-side requests
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------------------
   Health Check
---------------------------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* ---------------------------
   Routes
---------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api", actionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api/chatbot", chatbotRoutes); // ✅ added

/* ---------------------------
   404 handler
---------------------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------------------
   Global error handler
---------------------------- */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large" });
  }

  if (err.message?.includes("Only images, videos, or PDF")) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS blocked this request" });
  }

  res.status(500).json({ message: err.message || "Server error" });
});

/* ---------------------------
   Start Server
---------------------------- */
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ DB synced");
    console.log("✅ OpenAI key loaded:", !!process.env.OPENAI_API_KEY); // optional debug
    app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB sync failed:", err);
    process.exit(1);
  });