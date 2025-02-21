const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Product = require('../models/Product.model');

// Set mongoose strictQuery option to avoid deprecation warning
mongoose.set('strictQuery', false);

// Set faker locale to Russian
faker.locale = 'ru';

// Set default values for environment variables
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/fashion';
const PORT = process.env.PORT || 5000;

mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => {
  console.log("Connected to database");
  seedProducts();
}).catch(err => console.error(err));

async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Generate fake products
    const products = [];
    for (let i = 0; i < 50; i++) {
      products.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        categories: [faker.commerce.department()],
        image: faker.image.url(),
        inStock: faker.datatype.boolean(),
        size: [faker.helpers.arrayElement(['S', 'M', 'L', 'XL'])],
        color: [faker.color.human()],
      });
    }

    // Insert fake products into the database
    await Product.insertMany(products);

    console.log("50 fake products have been added to the database");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}