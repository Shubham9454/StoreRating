Store Rating System - Backend

This is the backend service for the Store Rating System — a web application where users can register, rate stores, and manage ratings.
It is built with Node.js, Express.js, and MySQL, with secure authentication and role-based access.

🚀 Features
👨‍💼 System Administrator

✅ Add new stores, normal users, and store owners/admins

✅ Dashboard with total users, stores, and ratings

✅ View and filter lists of stores and users

✅ Sort listings by Name, Email, Address, and Role

✅ View user details including ratings for store owners

👤 Normal User

✅ Sign up and login securely

✅ Update password after logging in

✅ View all registered stores with ratings

✅ Search stores by Name and Address

✅ Submit and update ratings (1–5 stars)

✅ View personal submitted ratings

🏪 Store Owner

✅ Login to the platform

✅ Update password after logging in

✅ View dashboard with average rating of their store

✅ See list of users who rated their store

🛠 Tech Stack

Backend: Node.js, Express.js

Database: MySQL

Authentication: JWT tokens

Password Hashing: bcryptjs

Validation: validator

Frontend (separate repo): React.js with Tailwind CSS

⚙️ Setup Instructions
🔑 Prerequisites

Node.js (v14 or higher)

MySQL (v8.0 or higher)

npm or yarn

1️⃣ Database Setup

Open MySQL shell and create database:

mysql -u root -p
CREATE DATABASE store_rating_db;
exit


Import schema:

mysql -u root -p store_rating_db < schema.sql

2️⃣ Backend Setup

Clone the repo:

git clone https://github.com/your-username/store-rating-backend.git
cd store-rating-backend


Install dependencies:

npm install express cors bcryptjs jsonwebtoken mysql2 validator
npm install -D nodemon

3️⃣ Environment Variables

Create a .env file in the root directory:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=store_rating_db
JWT_SECRET=your_jwt_secret
PORT=5000

4️⃣ Run the Backend Server

For development (with nodemon):

npm run dev


For production:

npm start


Server will run at:
👉 http://localhost:5000

📡 API Endpoints (Examples)
Authentication

POST /api/auth/register → Register user

POST /api/auth/login → Login user

Stores

GET /api/stores → Get all stores

POST /api/stores → Add new store (Admin only)

Ratings

POST /api/ratings → Submit rating

PUT /api/ratings/:id → Update rating

GET /api/ratings/user/:id → Get user’s ratings

🧑‍💻 Contributing

Fork this repo

Create a feature branch (git checkout -b feature-name)

Commit changes (git commit -m "Added feature XYZ")

Push to branch (git push origin feature-name)

Open a Pull Request
