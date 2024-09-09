const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
exports.register = async (req, res) => {
  const { email, password} = req.body;
  try {
    const user = await User.create({ email, password, role:'user' });
    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.status(201).json({ token, message: `Hello, ${email}!` });
  } catch (err) {
    res.status(400).json({ message: 'Error in registration' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.status(200).json({ token, message: `Hello, ${email}!` });
  } catch (err) {
    res.status(400).json({ message: 'Error in login' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};
