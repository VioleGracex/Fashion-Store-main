const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User.model');

dotenv.config();
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/fashion';

// Connect to MongoDB
mongoose.set('strictQuery', false);  // Suppress the deprecation warning
mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => console.log("Connected to database"))
.catch(err => {
  console.error(err);
  process.exit(1);
});

// Seed Admin User
const seedAdminUser = async () => {
  const fullname = "Admin User";
  const email = "admin@example.com";
  const password = "adminpassword";

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const adminUser = await User.create({
      fullname,
      email,
      password: passwordHash,
      isAdmin: true,
    });

    console.log('Admin user created:', adminUser);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
};

seedAdminUser();