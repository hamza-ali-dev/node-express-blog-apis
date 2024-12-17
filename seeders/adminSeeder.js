require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const logger = require('../utils/logger');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash('adminpassword', 10);

    await User.create({
      name: 'Admin',
      firstName: 'Default',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      country: 'Xyz',
      isVerified: true,
    });

    logger.info('Admin user seeded successfully.');
    process.exit();
  } catch (error) {
    logger.error(`Error seeding admin user: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
