const Product = require('../models/productModel');

// Superadmin only: Add a product
exports.addProduct = async (req, res) => {
  const { title, description, price } = req.body;
  const imageUrl = req.file.path;
  try {
    const product = await Product.create({ title, description, price, imageUrl });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error in adding product' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: 'Error in fetching products' });
  }
};
