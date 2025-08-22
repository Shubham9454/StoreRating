const express = require("express");
const authenticateToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

const ratingRouter = express.Router();

app.post('/api/ratings', authenticateToken, requireRole(['normal_user']), async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if store exists
    const [storeExists] = await pool.execute('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (storeExists.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if user already rated this store
    const [existingRating] = await pool.execute(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existingRating.length > 0) {
      // Update existing rating
      await pool.execute(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, userId, storeId]
      );
    } else {
      // Insert new rating
      await pool.execute(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [userId, storeId, rating]
      );
    }

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = ratingRouter;