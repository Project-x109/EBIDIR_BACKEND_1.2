const mongoose = require("mongoose");
const BranchSchema = new mongoose.Schema({
  bank_name: {
    type: String,
    required: [true, "Please Enter Bank Name"],
  },
  branch_name: {
    type: String,
    required: [true, "Please Enter Branch Name"],
  },
  branch_code: {
    type: String,
    required: [true, "Please Enter Branch code"],
    unique:true
  },
  branch_email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  branch_phoneNo: {
    type: String,
    required: [true, "Please Enter Branch phone"],
    unique: true,
  },
  location: {
    type: String,
    required: [true, "Please Enter Branch Location"],
  },
  manager:{
    type: String,
    required: [true, "Please Enter Branch Manager full name"],
  },
  role: {
    type: String,
    default: "branch",
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
module.exports = mongoose.model("Branch", BranchSchema);
