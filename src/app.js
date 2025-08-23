const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');


const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());



// Routes

// Authentication Routes
const authRouter = require("./routes/authentication");
app.use("/" , authRouter);

// User Routes
const userRouter = require("./routes/user");
app.use("/" , userRouter);

// Admin Routes
const adminRouter = require("./routes/admin");
app.use("/" , adminRouter);

// Store Routes
const storeRouter = require("./routes/store");
app.use("/" , storeRouter);

// Rating Routes
const ratingRouter = require("./routes/rating");
app.use("/" , ratingRouter);

// Store Owner Routes
const storeOwnerRouter = require("./routes/storeOwner");
app.use("/" , storeOwnerRouter);


// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'store_rating_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});