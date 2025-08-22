const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const mysql = require('mysql2/promise');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// // Database connection
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'password',
//   database: process.env.DB_NAME || 'store_rating_db',
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });


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


// connecting with database
const connectDB = require("./config/database");
const { default: mongoose } = require("mongoose");

connectDB()
  .then(() => {
    console.log("Database connection established");

    const port = 7777;

    app.listen(port, () => {
      console.log("Server is listening on port no.", port);
    });
  })
  .catch((error) => {
    console.error("Database connection failed");
  });