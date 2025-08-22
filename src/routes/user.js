const express = require("express");
const authenticateToken = require("../middlewares/auth");
const { validatePassword } = require("../utils/validation");
const bcrypt = require("bcryptjs");

const userRouter = express.Router();


userRouter.put('/api/users/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: 'Invalid new password format' });
    }

    // Get current password
    const [result] = await pool.execute('SELECT password FROM users WHERE id = ?', [userId]);
    const user = result[0];

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = userRouter;