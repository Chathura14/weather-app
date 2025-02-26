const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');


// Route to store user details
router.post('/add', async (req, res) => {
  const { email, location } = req.body;

  // Validate request data
  if (!email || !location) {
    return res.status(400).json({ error: "Email and location are required!" });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Update user location if already exists
      user.location = location;
      await user.save();
    } else {
      // Create new user only if not exists
      const newUser = new User({ email, location, weatherData: [] });
      await newUser.save();
    }

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update user location
router.put('/update-location/:email', async (req, res) => {
  const { email } = req.params;
  const { location } = req.body;
  try {
    const user = await User.findOneAndUpdate({ email }, { location }, { new: true });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to get user's weather data for a given day
router.get('/weather/:email/:date', async (req, res) => {
  const { email, date } = req.params;
  try {
    const user = await User.findOne({ email });
    const weatherData = user.weatherData.find(data => data.date === date);
    res.status(200).send(weatherData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to get user location using email
router.get('/location/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json({ email: user.email, location: user.location });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to generate and send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60000);

  try {
    await User.updateOne({ email }, { otp, otpExpires }, { upsert: true });
    await sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`);
    res.status(200).send('OTP sent to email');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).send('Invalid or expired OTP');
    }
    
    // Set verifyStatus to true when OTP is verified
    user.verifyStatus = true;
    await user.save();
    
    res.status(200).send('OTP verified');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Route to unsubscribe user with OTP verification
router.post('/unsubscribe', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // If OTP is verified, delete the user
    await User.deleteOne({ email });

    res.status(200).json({ message: 'User unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
