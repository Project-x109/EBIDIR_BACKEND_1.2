const mongoose = require("mongoose");
const personalDetailsSchema = new mongoose.Schema({
  age: {
    type: Number,
    required: [true, "Please Enter Your Age"],
  },
  Education_Status: {
    type: String,
    required: [true, "Please Enter Your Education Status"],
  },
  Marriage_Status: {
    type: String,
    required: [true, "Please Enter Your Marriage Status"],
  },
  Number_Of_Dependents: {
    type: Number,
    required: [true, "Please Enter Your Number Of Dependents"],
  },
  Criminal_Record: {
    type: String,
    required: [true, "Please Enter Your Criminal Record"],
  },
  id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    // unique:true
  },
  PersonalScore: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Personal", personalDetailsSchema);
