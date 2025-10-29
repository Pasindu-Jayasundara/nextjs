const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user store for demo purposes. Replace with a database in production.
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existing = users.find(u => u.email === email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = { id: Date.now().toString(), email: email.toLowerCase(), name: name || '', passwordHash };
    users.push(user);

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ id: user.id, email: user.email, name: user.name, token });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
  try {
    // Expect Bearer token
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing or invalid Authorization header' });

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    if (typeof newPassword !== 'string' || newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });

    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) return res.status(401).json({ error: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Change-password error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
