const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  gender: {
    type: String,
    required: [true, "Please Enter Gender"],
  },
  phoneNo: {
    type: String,
    required: [true, "Please Enter phone"],
    unique: true,
  },
  role: {
    type: String,
    default: "agent",
  },
  profile: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  status: {
    type: String,
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Agent", AgentSchema);
