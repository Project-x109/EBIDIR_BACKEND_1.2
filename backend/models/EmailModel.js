const mongoose = require("mongoose");
const EmailSchema = new mongoose.Schema({
  to: {
    type: String,
    required: [true, "Please Enter Recipent Email address"],
  },
  subject: {
    type: String,
    required: [true, "Please Enter Subject "],
  },
  body: {
    type: String,
    required: [true, "Please Enter Body"],
    unique:true
  },
  cc: {
    type: String,
  },
  bcc: {
    type: String,
  },
  type: {
    type: String,
    required: [true, "Please Enter Email type"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Email", EmailSchema);
