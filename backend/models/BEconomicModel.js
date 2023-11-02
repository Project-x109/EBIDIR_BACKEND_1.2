const mongoose = require("mongoose");
const BEconomicStatusSchema = new mongoose.Schema({
  Number_of_Employees: {
    type: Number,
    min:[0,"Number Of Employees  cant be negative"],
    max:[20000,"Number of Employees cant exceed 20000"],
    validate : {
      validator : Number.isInteger,
      message   : 'Number Of Employees must be integer'
    },
    required: [true, "Please Enter Your Number of Employees"], 
  },
  Total_Monthly_Income: {
    min:[10000,"Monthly Incomes cant be negative"],
    max:[2000000,"Monthely Incomes cant exceed 2000000"],
    type: Number,
    required: [true, "Please Enter Your Total Monthly Income"],
  },
  year: {
    type: Number,
    min:[1900,"Year of establishment cant be below 1900"],
    max:[2023,"Year of establishment cant be in the future"],
    validate : {
      validator : Number.isInteger,
      message   : 'Year must be integer'
    },
    required: [true, "Please Enter Your year of Establishment"],
  },
  economicScore: {
    type: Number,
  },
  FCCR: {
    type: Number,
    required: [true, "Please Enter Your FCCR"],
    min:[0,"FCBT cant be negative"],
    max:[20,"FCBT cant exceed 20"],
  },
  Number_Of_Loans: {
    type: Number,
    min:[0,"Number Of Loans  cant be negative"],
    max:[10,"Number of loans cant exceed 10"],
    validate : {
      validator : Number.isInteger,
      message   : 'Number Of Loans must be integer'
    },
    required: [true, "Please Enter Your Number Of Loans"],
  },

  Buildings: {
    type: Number,
    default: 0,
    min:[0,"Number of buildings cant be negative"],
    max:[1000,"Number of buildings cant exceed 1000"],
    validate : {
      validator : Number.isInteger,
      message   : 'Number Buildings must be integer'
    },
  },
  Vehicles: {
    type: Number,
    default: 0,
    min:[0,"Number of vehicles cant be negative"],
    max:[10000,"Number of Vehicles cant exceed 10000"],
    validate : {
      validator : Number.isInteger,
      message   : 'Number Vegicles must be integer'
    },
  },
  Lands: {
    type: Number,
    default: 0,
    min:[0,"Number of Lands cant be negative"],
    max:[100,"Number of Lands cant exceed 100"],
    validate : {
      validator : Number.isInteger,
      message   : 'Number Lands must be integer'
    },
  },
  Companies: {
    type: Number,
    default: 0,
    min:[0,"Number of Companies cant be negative"],
    max:[50,"Number of Companies cant exceed 50"],
    validate : {
      validator : Number.isInteger,
      message   : 'Number Companies must be integer'
    },
  },
  EBIT: {
    type: Number,
    default: 0,
    min:[0,"EBIT cant be negative"],
    max:[5000000,"EBIT cant exceed 5000000"],
  },
  FCBT: {
    type: Number,
    default: 0,
    min:[0,"FCBT cant be negative"],
    max:[5000000,"FCBT cant exceed 5000000"],
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
  economicScore: {
    type: Number,
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
module.exports = mongoose.model("BEconomic", BEconomicStatusSchema);
