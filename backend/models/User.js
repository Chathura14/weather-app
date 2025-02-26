const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  date: String,
  weather: String,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  location: { type: String, required: false },
  weatherData: [weatherSchema],
  otp: { type: String },
  otpExpires: { type: Date },
  verifyStatus: { type: Boolean, default: false } 
});


module.exports = mongoose.model('User', userSchema);
