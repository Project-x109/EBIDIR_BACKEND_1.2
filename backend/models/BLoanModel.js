const mongoose = require("mongoose");
const BLoanSchema = new mongoose.Schema({
  loan_amount: {
    type: Number,
    required: [true, "Please Enter Your loan amount"],
  },
  Reason_for_loan: {
    type: String,
    required: [true, "Please Enter Your Reason for loan"],
  },
  Loan_Payment_Period: {
    type: String,
    required: [true, "Please Enter Your Loan Payment Period"],
  },
  Bank: {
    type: String,
    required: [true, "Please Enter Your Bank"],
  },
  Branch: {
    type: mongoose.Schema.ObjectId,
    ref:"Branch",
    required: [true, "Please Enter Your Bank"],
  },
  Type_Of_Loan: {
    type: String,
    required: [true, "Please Enter Your Loan Type"],
  },
  Types_of_Collateral: {
    type: String,
    required: [true, "Please Enter Your Types of Collateral"],
  },
  Monthly_payment: {
    type: Number,
    required: [true, "Please Enter Your Monthly Payment"],
  },
  totalCollateral: {
    car:{
     type: Number,
     default: 0
    },
    building:{
     type: Number,
     default:0
    }
   },
  interest: {
    type: Number,
    required: [true, "Please Enter Your Interest"],
  },
  rank: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
  paidMonths: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "pending",
  },
  id: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("BLoan", BLoanSchema);
