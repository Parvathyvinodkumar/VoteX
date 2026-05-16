const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Candidate = require("../models/Candidate");
const { jwtAuthMiddleware } = require("../jwt");

// =====================================
// ADMIN CHECK
// =====================================
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user?.role === "admin";
  } catch (err) {
    return false;
  }
};

// =====================================
// ADD CANDIDATE
// =====================================
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {

    const newCandidate = new Candidate(req.body);
    const response = await newCandidate.save();

    return res.status(201).json(response);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// =====================================
// GET ALL CANDIDATES (IMPORTANT)
// =====================================
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ name: 1 });
    return res.status(200).json(candidates);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =====================================
// VOTE COUNT
// =====================================
router.get("/vote/count", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: -1 });

    const voteRecord = candidates.map((c) => ({
      party: c.party,
      count: c.voteCount,
    }));

    return res.status(200).json(voteRecord);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =====================================
// CAST VOTE
// =====================================
router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    const { candidateId } = req.params;
    const userId = req.user.id;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate Not Found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ error: "Admin can't vote" });
    }

    const alreadyVoted = await Candidate.findOne({
      "votes.user": userId,
    });

    if (alreadyVoted) {
      return res.status(400).json({ error: "You have already voted!" });
    }

    candidate.votes.push({ user: userId });
    candidate.voteCount += 1;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    return res.status(200).json({
      message: "Vote Casted Successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =====================================
// UPDATE CANDIDATE
// =====================================
router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(403)
        .json({ message: "user doesn't have admin role" });
    }

    const updated = await Candidate.findByIdAndUpdate(
      req.params.candidateId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ error: "Candidate not found!" });
    }

    return res.status(200).json(updated);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// =====================================
// DELETE CANDIDATE
// =====================================
router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(403)
        .json({ message: "user doesn't have admin role" });
    }

    const deleted = await Candidate.findByIdAndDelete(
      req.params.candidateId
    );

    if (!deleted) {
      return res.status(404).json({
        error: "Candidate Not Found",
      });
    }

    return res.status(200).json({
      message: "Candidate Deleted",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// =====================================
// SINGLE CANDIDATE (MUST BE LAST)
// =====================================
router.get("/:candidateId", async (req, res) => {
  try {
    const candidate = await Candidate.findById(
      req.params.candidateId
    );

    if (!candidate) {
      return res.status(404).json({
        error: "Candidate not found!",
      });
    }

    return res.status(200).json(candidate);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;