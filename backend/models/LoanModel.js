const mongoose = require("mongoose");
const LoanSchema = new mongoose.Schema({
  loan_amount: {
    type: Number,
    required: [true, "Please Enter Your loan amount"],
    min:[1000,"Loan amout must be greater than 1000 ETB"],
    max:[20000000,"Loan amout must be less than 20000000"]
  },
  Reason_for_loan: {
    type: String,
    required: [true, "Please Enter Your Reason for loan"],
    minlength: [20," Reason for loan must at least 20 charactrs long"],
    maxlength: [250," Reason for loan must at most 250 charactrs long"] 
  },
  Loan_Payment_Period: {
    type: Number,
    required: [true, "Please Enter Your Loan Payment Period"],
    min:[1,"Payment peroid has to be greater than 1 month"],
    validate : {
      validator : Number.isInteger,
      message   : 'Loan Payment Period must be integer'
    }
  },
  Job_Status: {
    type: String,
    required: [true, "Please Enter Your Job Status"],
  },
  Bank: {
    type: String,
    required: [true, "Please Enter Your Bank"],
  },
  Branch: {
    type: mongoose.Schema.ObjectId,
    ref:"Branch",
    required: [true, "Please Enter Your Branch"],
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
    min:[0,"Monthly payment must be greater than Zero"],
    max:[2000000,"Monthly payment must be greater than 2000000"]
  },
  interest: {
    type: Number,
    required: [true, "Please Enter Your Interest"],
    min:[0,"Interest must be greater than 0"],
    max:[1,"Interest must be greater than 1"]
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
  status: {
    type: String,
    default: "pending",
  },
  paidMonths: {
    type: Array,
    default: [],
  },
  rank: {
    type: String,
  },
  id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Loan", LoanSchema);
