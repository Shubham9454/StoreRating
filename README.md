# Store Rating System - FullStack Application
A comprehensive web application that allows users to submit ratings for stores. Built with Express.js, PostgreSQL, and React.js.
## Features

### System Administrator

✅ Add new stores, normal users, and admin users
✅ Dashboard with total users, stores, and ratings
✅ View and filter lists of stores and users
✅ Sort all listings by Name, Email, Address, and Role
✅ View user details including ratings for store owners

### Normal User

✅ Sign up and login to the platform
✅ Update password after logging in
✅ View all registered stores with ratings
✅ Search stores by Name and Address
✅ Submit and modify ratings (1-5 stars)
✅ View personal submitted ratings

### Store Owner

✅ Login to the platform
✅ Update password after logging in
✅ View dashboard with average rating
✅ See list of users who rated their store

## Tech Stack

Backend: Express.js with Node.js
Database: MongoDB
Frontend: React.js with Tailwind CSS
Authentication: JWT tokens
Password Hashing: bcryptjs

## Setup Instructions
Prerequisites

Node.js (v14 or higher)
MySQL (v8.0 or higher)
npm or yarn

1. Database Setup
bash# Install MySQL and create database
mysql -u root -p
CREATE DATABASE store_rating_db;
exit

### Run the schema file
mysql -u root -p store_rating_db < schema.sql
2. Backend Setup
bash# Create backend directory
mkdir store-rating-backend
cd store-rating-backend

### Initialize npm and install dependencies
npm init -y
npm install express cors bcryptjs jsonwebtoken mysql2 validator
npm install -D nodemon

### Create the server.js file (copy the backend code)
### Create .env file with your database credentials

### Start the backend server
npm run dev
