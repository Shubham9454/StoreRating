import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Shubhamy1234!@#$",
  database: "store_rating_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

