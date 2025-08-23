const express = require("express");
const authenticateToken = require("../middlewares/auth");
const { pool } = require("../config/database");
const storeRouter = express.Router();

storeRouter.get('/api/stores', authenticateToken, async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT s.id, s.name, s.address, 
             COALESCE(AVG(r.rating), 0) as overall_rating,
             ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [userId];

    if (search) {
      query += ` AND (s.name LIKE ? OR s.address LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY s.id, s.name, s.address, ur.rating`;
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    const [result] = await pool.execute(query, params);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = storeRouter;