const Cart = require('../models/cartModel');

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }
    cart.products.push({ product: productId, quantity });
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: 'Error in adding to cart' });
  }
};

// Review cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product');
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: 'Error in fetching cart' });
  }
};

// Checkout
exports.checkout = async (req, res) => {
  const { shippingAddress } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    cart.shippingAddress = shippingAddress;
    await cart.save();
    // Clear the cart after checkout
    cart.products = [];
    await cart.save();
    res.json({ message: 'Checkout successful' });
  } catch (err) {
    res.status(400).json({ message: 'Error in checkout' });
  }
};
