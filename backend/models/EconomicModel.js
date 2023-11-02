const mongoose = require("mongoose");
const EconomicStatusSchema = new mongoose.Schema({
  field_of_employment: {
    type: String,
    required: [true, "Please Enter Your field of employment"],
    minlength: [4," Field of Employeement must at least 4 charactrs long"],
    maxlength: [100,"Field of Employeement must at most 100 charactrs long"]
  },
  Source_of_income: {
    type: Number,
    min:[0,"source of income must be cant be negative"],
    max:[10,"source of income cant exceed 10"],
    required: [true, "Please Enter Your Source of income"],
    validate : {
      validator : Number.isInteger,
      message   : 'Source of income must be integer'
    }
  },
  Experience: {
    type: Number,
    required: [true, "Please Enter Your Experience"],
    min:[0,"Experience must be cant be negative"],
    max:[50,"Experience cant exceed 50"],
    validate : {
      validator : Number.isInteger,
      message   : 'Experience must be integer'
    }
  },
  Number_Of_Loans: {
    type: Number,
    required: [true, "Please Enter Your Number Of Loans"],
    min:[0,"Number Of Loans must be cant be negative"],
    max:[10,"Number of loans cant exceed 10"],
    validate : {
      validator : Number.isInteger,
      message   : 'Number Of Loans must be integer'
    }
  },
  DTI: {
    type: Number,
    required: [true, "Please Enter Your DTI"],
  },
  fully_repaid_loans: {
    type: Number,
    required: [true, "Please Enter Your fully repaid loans"],
    min:[0,"fully repaid loans cant be negative"],
    max:[10,"fully repaid score cant exceed 10"],
    validate : {
      validator : Number.isInteger,
      message   : 'Number fully repaid loans must be integer'
    }
  },
  Total_Monthly_Income: {
    type: Number,
    min:[1000,"Total Monthly Income cant be negative"],
    max:[10000000,"Total Monthly is invalid"],
    required: [true, "Please Enter Your Total_Monthly_Income"],

  },
  economicScore: {
    type: Number,
  },
  id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Economic", EconomicStatusSchema);
