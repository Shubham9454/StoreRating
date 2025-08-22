const express = require("express");
const storeOwnerRouter = express.Router();

app.get('/api/store-owner/dashboard', authenticateToken, requireRole(['store_owner']), async (req, res) => {
  try {
    const userId = req.user.id;

    // Get store info
    const [storeResult] = await pool.execute('SELECT id FROM stores WHERE owner_id = ?', [userId]);
    if (storeResult.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const storeId = storeResult[0].id;

    // Get average rating
    const [avgRating] = await pool.execute(
      'SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = ?',
      [storeId]
    );

    // Get users who rated the store
    const [ratingsResult] = await pool.execute(`
      SELECT u.name, u.email, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `, [storeId]);

    res.json({
      averageRating: parseFloat(avgRating[0].average_rating).toFixed(1),
      ratings: ratingsResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = storeOwnerRouter;