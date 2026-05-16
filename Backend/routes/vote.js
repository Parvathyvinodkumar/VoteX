const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Vote = require("../models/Vote");

router.post("/vote", async (req, res) => {
  try {

    const {
      userId,
      candidate,
      latitude,
      longitude,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already voted
    if (user.isVoted) {
      return res.status(403).json({
        success: false,
        message: "You already voted",
      });
    }

    // First location
    if (!user.lastLocation.latitude) {

      user.lastLocation = {
        latitude,
        longitude,
      };

      user.count_locations = 1;

    } else {

      // Check location change
      const changed =
        user.lastLocation.latitude !== latitude ||
        user.lastLocation.longitude !== longitude;

      if (changed) {
        user.count_locations += 1;
      }

      // Suspicious activity
      if (user.count_locations > 1) {
        return res.status(403).json({
          success: false,
          suspicious: true,
          message: "Suspicious vote detected",
        });
      }
    }

    user.isVoted = true;

    await user.save();

    // Save vote
    const newVote = new Vote({
      userId,
      candidate,
    });

    await newVote.save();

    return res.json({
      success: true,
      message: "Vote successful",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;