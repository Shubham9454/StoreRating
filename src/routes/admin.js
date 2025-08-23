const express = require("express");
const bcrypt = require('bcryptjs');
const authenticateToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const { validateName, validateEmail, validateAddress, validatePassword } = require("../utils/validation");
const { pool } = require("../config/database");


const adminRouter = express.Router();

adminRouter.get('/api/admin/dashboard', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [storesCount] = await pool.execute('SELECT COUNT(*) as count FROM stores');
    const [ratingsCount] = await pool.execute('SELECT COUNT(*) as count FROM ratings');

    res.json({
      totalUsers: usersCount[0].count,
      totalStores: storesCount[0].count,
      totalRatings: ratingsCount[0].count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

adminRouter.post('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    // Validation
    if (!validateName(name) || !validateEmail(email) || !validateAddress(address) || !validatePassword(password)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    if (!['admin', 'normal_user', 'store_owner'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
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
      [name, email, address, hashedPassword, role]
    );

    // Get the inserted user
    const [newUser] = await pool.execute(
      'SELECT id, name, email, address, role FROM users WHERE id = ?',
      [result.insertId]
    );

    // If store owner, create store entry
    if (role === 'store_owner') {
      await pool.execute(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [name, email, address, newUser[0].id]
      );
    }

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

adminRouter.post('/api/admin/stores', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, address } = req.body;

    // Validation
    if (!validateName(name) || !validateEmail(email) || !validateAddress(address)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Create store owner user first
    const password = 'TempPass123!'; // Temporary password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await pool.execute(
      'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, address, hashedPassword, 'store_owner']
    );

    // Create store
    const [storeResult] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, userResult.insertId]
    );

    // Get the created store
    const [newStore] = await pool.execute(
      'SELECT * FROM stores WHERE id = ?',
      [storeResult.insertId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: newStore[0],
      tempPassword: password
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

adminRouter.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { sortBy = 'name', sortOrder = 'ASC', name, email, address, role } = req.query;
    
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, 
             COALESCE(AVG(r.rating), 0) as rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += ` AND u.name LIKE ?`;
      params.push(`%${name}%`);
    }
    if (email) {
      query += ` AND u.email LIKE ?`;
      params.push(`%${email}%`);
    }
    if (address) {
      query += ` AND u.address LIKE ?`;
      params.push(`%${address}%`);
    }
    if (role) {
      query += ` AND u.role = ?`;
      params.push(role);
    }

    query += ` GROUP BY u.id, u.name, u.email, u.address, u.role`;
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    const [result] = await pool.execute(query, params);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

adminRouter.get('/api/admin/stores', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { sortBy = 'name', sortOrder = 'ASC', name, email, address } = req.query;
    
    let query = `
      SELECT s.id, s.name, s.email, s.address, 
             COALESCE(AVG(r.rating), 0) as rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += ` AND s.name LIKE ?`;
      params.push(`%${name}%`);
    }
    if (email) {
      query += ` AND s.email LIKE ?`;
      params.push(`%${email}%`);
    }
    if (address) {
      query += ` AND s.address LIKE ?`;
      params.push(`%${address}%`);
    }

    query += ` GROUP BY s.id, s.name, s.email, s.address`;
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    const [result] = await pool.execute(query, params);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = adminRouter;

