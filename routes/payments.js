const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory transaction store for demo
const transactions = [];

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

// POST /api/payments
// expects Authorization: Bearer <token>
// body: { productId, paymentToken }
router.post('/', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing or invalid Authorization header' });

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { productId, paymentToken } = req.body || {};
    if (!productId || !paymentToken) return res.status(400).json({ error: 'productId and paymentToken are required' });

    // Mock processing: accept any paymentToken
    const tx = {
      id: 'tx_' + Date.now().toString(36),
      userId: payload.id,
      productId,
      paymentToken,
      amount: req.body.amount || null,
      date: new Date().toISOString()
    };
    transactions.push(tx);

    return res.json({ message: 'Payment processed (mock)', transaction: tx });
  } catch (err) {
    console.error('Payments error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// optional: GET /api/payments/transactions (for demo)
router.get('/transactions', (req, res) => {
  res.json(transactions);
});

module.exports = router;
