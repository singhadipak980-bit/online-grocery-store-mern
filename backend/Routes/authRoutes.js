const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ PASS PLAIN PASSWORD
    await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  const email = req.body.email?.toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({ message: "MISSING_FIELDS" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ User not found in DB");
    return res.status(400).json({ message: "USER_NOT_FOUND" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("❌ Password mismatch");
    return res.status(400).json({ message: "PASSWORD_MISMATCH" });
  }

  if (!process.env.JWT_SECRET) {
    console.log("❌ JWT_SECRET missing");
    return res.status(500).json({ message: "JWT_SECRET_MISSING" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  console.log("✅ LOGIN SUCCESS");

  res.json({ token });
});


module.exports = router;
