const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");


// --------------------
// ADMIN CHECK
// --------------------
const checkAdmin = async () => {
  const count = await User.countDocuments({ role: "admin" });
  return count >= 1;
};


// --------------------
// SIGNUP
// --------------------
router.post("/signup", async (req, res) => {
  try {

    const data = req.body;

    console.log("SIGNUP DATA:", data);

    // --------------------
    // AGE VALIDATION
    // --------------------
    const age = Number(data.age);

    if (!age || age < 18) {
      return res.status(400).json({
        success: false,
        message: "Age must be 18 or above",
      });
    }
    // --------------------
// MOBILE VALIDATION
// --------------------
const mobile = String(data.mobile);

if (!/^\d{10}$/.test(mobile)) {
  return res.status(400).json({
    success: false,
    message: "Mobile number must be exactly 10 digits",
  });
}


    // --------------------
    // ADMIN SIGNUP
    // --------------------
    if (data.role === "admin") {

      // only one admin
      if (await checkAdmin()) {
        return res.status(403).json({
          success: false,
          message: "Only one admin allowed",
        });
      }

      // validate admin key
      if (data.specialkey !== process.env.JWT_SECRET) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin key",
        });
      }

      const saved = await new User(data).save();

      const token = generateToken({
        id: saved._id,
        role: saved.role,
      });

      return res.json({
        success: true,
        saved,
        token,
      });
    }

    // --------------------
    // NORMAL VOTER SIGNUP
    // --------------------
    const saved = await new User(data).save();

    const token = generateToken({
      id: saved._id,
      role: saved.role,
    });

    return res.json({
      success: true,
      saved,
      token,
    });

  } catch (err) {

    console.log("SIGNUP ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


// --------------------
// LOGIN
// --------------------
router.post("/login", async (req, res) => {
  try {

    const { aadhaar, password, specialkey } = req.body;

    const user = await User.findOne({ aadhaar });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const ok = await user.comparePassword(password);

    if (!ok) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // --------------------
    // ADMIN CHECK
    // --------------------
    if (user.role === "admin") {

      if (specialkey !== process.env.JWT_SECRET) {
        return res.status(403).json({
          message: "Invalid admin key",
        });
      }
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
      isVoted: user.isVoted,
    });

    return res.json({ token });

  } catch (err) {

    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
});


// --------------------
// PROFILE
// --------------------
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    return res.json({ user });

  } catch (err) {

    return res.status(500).json({
      error: "Server error",
    });
  }
});


// --------------------
// PASSWORD UPDATE
// --------------------
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const { currentPassword, newPassword } = req.body;

    const ok = await user.comparePassword(currentPassword);

    if (!ok) {
      return res.status(401).json({
        error: "Wrong password",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.json({
      message: "Password updated",
    });

  } catch (err) {

    return res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;