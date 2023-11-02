const mongoose = require("mongoose");
const OtpSchema = new mongoose.Schema({
    to: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
  otp: {
    type: Number,
    required: [true, "Please Enter Otp "],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status:{
    type:String,
    default:"active"
  }
});
module.exports = mongoose.model("otp", OtpSchema);
