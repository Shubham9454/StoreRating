const express = require("express");
const { validateName, validateEmail, validateAddress, validatePassword } = require("../utils/validation");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


const authRouter = express.Router();

authRouter.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // Validation
    if (!validateName(name)) {
      return res.status(400).json({ error: 'Name must be between 20-60 characters' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validateAddress(address)) {
      return res.status(400).json({ error: 'Address must be max 400 characters' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be 8-16 characters with at least one uppercase letter and one special character' });
    }

    // Check if user exists
    const [userExists] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, address, hashedPassword, 'normal_user']
    );

    // Get the inserted user
    const [newUser] = await pool.execute(
      'SELECT id, name, email, address, role FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const [result] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = authRouter;