const express = require("express");
require("dotenv").config();
const voteRoutes = require("./routes/vote");
const app = express();

// DB connection
require("./db");

const cors = require("cors");

// ==============================
// MIDDLEWARES (ORDER MATTERS)
// ==============================
app.use(cors({
  origin: "http://localhost:3000", // IMPORTANT for Next.js
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", voteRoutes);
// ==============================
// REQUEST LOGGER (KEEP THIS HERE)
// ==============================
app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

// ==============================
// ROUTES
// ==============================
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidatesRoutes");

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

// ==============================
// ROOT TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("VoteX Backend Running 🚀");
});

// ==============================
// SERVER START
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});