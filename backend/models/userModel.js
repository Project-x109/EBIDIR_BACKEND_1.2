const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
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
  TIN_Number: {
    type: Number,
  },
  role: {
    type: String,
    default: "user",
  },
  scannedFiles: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
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
  rank: {
    type: String,
  },
  score: {
    type: Number,
    default: 50,
  },
  createdBy:{
    type: mongoose.Schema.ObjectId,
    ref: "Login",
   default:null
  },
  createdRole:{
type:String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("User", userSchema);
