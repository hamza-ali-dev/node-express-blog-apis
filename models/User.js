const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
});

module.exports = mongoose.model('User', userSchema);
