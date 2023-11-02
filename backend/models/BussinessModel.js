const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  cname: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  cemail: {
    type: String,
    required: [true, "Please Enter Your Email"], 
    unique: true,
  },
  General_Manager: {
    type: String,
    required: [true, "Please Enter General Manager name"],
  },
  cphoneNo: {
    type: String,
    required: [true, "Please Enter phone"],
  },
  status: {
    type: String,
    default: "waiting",
  },
  CTIN_Number: {
    type: Number,
    unique: [true, "TIN Number Exists"],
    required: [true, "Please Enter Your TIN Number"],
  },
  role: {
    type: String,
    default: "company",
  },
  legal_status: {
    type: String,
    required: [true, "Please Enter Legal Status"],
  },
  score: {
    type: Number,
    default: 50,
  },
  rank: {
    type: String,
  },
  sector: {
    type: String,
    required: [true, "Please Enter Sector type"],
  },
  createdBy:{
    type: mongoose.Schema.ObjectId,
    ref: "Login",
    default:null
  },
  createdRole:{
type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
  logo: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});
module.exports = mongoose.model("Company", CompanySchema);
