const express = require('express');
const { addToCart, getCart, checkout } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.post('/checkout', authMiddleware, checkout);

module.exports = router;
