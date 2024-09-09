const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://jsainitdgp2024:Sai%402805@saimongocluster.ckmt4.mongodb.net/');

const User = require('./models/userModel'); // Import user model


// Function to seed super admin user
const seedSuperAdmin = async () => {
  try {
    const superAdmin = await User.findOne({ email: 'admin@shop.com' });
    if (!superAdmin) {
      const adminUser = new User({
        email: 'admin@shop.com',
        password: 'admin123', // Make sure to hash this password later
        role: 'superadmin',
      });
      await adminUser.save();
      console.log('Super admin seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding super admin:', err);
  }
};

// Call the function after connecting to MongoDB
mongoose.connection.once('open', () => {
  seedSuperAdmin();
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(5000, () => console.log('Server running on port 5000'));



