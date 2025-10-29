const express = require('express');
const router = express.Router();

// Sample products (same shapes used by the UI)
const sampleProducts = [
  { id: 'p1', title: 'Aurora Headphones', price: 129, desc: 'Wireless over-ear headphones with active noise cancellation.', img: 'https://via.placeholder.com/320x180?text=Aurora' },
  { id: 'p2', title: 'Nimbus Smartwatch', price: 199, desc: 'Lightweight smartwatch with health tracking and GPS.', img: 'https://via.placeholder.com/320x180?text=Nimbus' },
  { id: 'p3', title: 'Lumen Desk Lamp', price: 59, desc: 'Adjustable LED lamp with touch controls and warm/cool modes.', img: 'https://via.placeholder.com/320x180?text=Lumen' },
  { id: 'p4', title: 'Quanta Speaker', price: 89, desc: 'Portable Bluetooth speaker with rich bass and 12h battery.', img: 'https://via.placeholder.com/320x180?text=Quanta' }
];

// GET /api/products
router.get('/', (req, res) => {
  res.json(sampleProducts);
});

module.exports = router;
