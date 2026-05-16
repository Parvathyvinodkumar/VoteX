const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,

  candidate: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vote", voteSchema);