const express = require('express');
const { addProduct, getAllProducts } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // For handling image uploads
const router = express.Router();

// Middleware to restrict access to superadmin only
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

router.post('/add', authMiddleware, adminMiddleware, upload.single('image'), addProduct); // Only superadmin can add products
router.get('/', getAllProducts); // Anyone can view products

module.exports = router;
