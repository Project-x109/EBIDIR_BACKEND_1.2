const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Economic = require("../models/EconomicModel");
const Loan = require("../models/LoanModel");
const BEconomic = require("../models/BEconomicModel");
const { getEconomicScore, GetCompanyScore } = require("../middlewares/Dataset");
const BLoanModel = require("../models/BLoanModel");
const ApplicationSetting = require("../models/ApplicationSetting");
const ErrorHandler = require("../utils/errorHandler");
const { EmptyValidation, isNumber } = require("../utils/Validations");
// Add
exports.addEconomicDetails = asyncErrorHandler(async (req, res,next) => {
  try{
  const id = req.user.id;
  const {
    field_of_employment,
    Source_of_income,
    Experience,
    Number_Of_Loans,
    fully_repaid_loans,
    Total_Monthly_Income
  } = req.body;
  EmptyValidation({field_of_employment,Source_of_income,Experience,Number_Of_Loans,fully_repaid_loans,Total_Monthly_Income})
  isNumber({Source_of_income,Experience,Number_Of_Loans,fully_repaid_loans,Total_Monthly_Income})
  const lastLoan = await Loan.findOne({ id: id }).sort({
    field: "asc",
    _id: -1,
  });
  if(!lastLoan)
  return next(new ErrorHandler("Loan not found",400))
  const DTI = lastLoan.Monthly_payment / Total_Monthly_Income;
  var economicScore = getEconomicScore(
    Source_of_income,
    Experience,
    Number_Of_Loans,
    DTI,
    fully_repaid_loans
  );
  const economic = await Economic.create({
    field_of_employment,
    Source_of_income,
    Experience,
    Number_Of_Loans,
    DTI: DTI,
    fully_repaid_loans,
    Total_Monthly_Income,
    economicScore: economicScore,
    id,
  });
  res.status(200).json({
    success: true,
    economic,
  });
}catch(err){
  return next(new ErrorHandler(err,400))
}
});
// bussiness economics
exports.addBEconomicDetails = asyncErrorHandler(async (req, res,next) => {
  try{
  const {
    Number_of_Employees,
    year,
    Total_Monthly_Income,
    Number_Of_Loans,
    Buildings,
    Vehicles,
    Lands,
    Companies,
    fully_repaid_loans,
    EBIT,
    FCBT,
  } = req.body;
  EmptyValidation({Number_of_Employees,year,Total_Monthly_Income, Number_Of_Loans,fully_repaid_loans,EBIT,FCBT})
  isNumber({Number_of_Employees,year,Total_Monthly_Income,Number_Of_Loans,fully_repaid_loans,EBIT,FCBT})
  const lastLoan = await BLoanModel.findOne({ id: req.user.id }).sort({
    field: "asc",
    _id: -1,
  });
  if(!lastLoan)
  return next(new ErrorHandler("Loan not found"))
  //var i=lastLoan.loan_amount * lastLoan.interest*lastLoan.Loan_Payment_Period
  var i =
    (lastLoan.loan_amount * lastLoan.interest * lastLoan.Loan_Payment_Period) /
    12;
  var FCCR = (EBIT + FCBT) / (FCBT + i);
  const DTI = Total_Monthly_Income / lastLoan.loan_amount;
  //const DTI=lastLoan.loan_amount/Total_Monthly_Income
  var economicScore = GetCompanyScore(
    Number_of_Employees,
    year,
    Number_Of_Loans,
    fully_repaid_loans,
    DTI,
    FCCR
  );
  const beconomic = await BEconomic.create({
    Number_of_Employees,
    year,
    Total_Monthly_Income,
    Number_Of_Loans,
    FCCR,
    Buildings,
    Vehicles,
    Lands,
    Companies,
    fully_repaid_loans,
    EBIT,
    economicScore: economicScore,
    FCBT,
    id: req.user.id,
  });
  res.status(200).json({
    success: true,
    beconomic,
  });
}catch(err){
  return next(new ErrorHandler(err,400))
}
});
// get single
exports.getEconomicDetails = asyncErrorHandler(async (req, res) => {
  const economic = await Economic.findOne({ id: req.user.id });
  res.status(200).json({
    success: true,
    economic,
  });
});
exports.getBEconomicDetails = asyncErrorHandler(async (req, res) => {
  const beconomic = await BEconomic.findOne({ id: req.user.id });
  res.status(200).json({
    success: true,
    beconomic,
  });
});
// get All
exports.getAllEconomic = asyncErrorHandler(async (req, res) => {
  const economics = await Economic.find();
  res.status(200).json({
    success: true,
    economics,
  });
});
exports.updateEconomic = asyncErrorHandler(async (req, res,next) => {
try{
  const {
    field_of_employment,
    Source_of_income,
    Experience,
    Number_Of_Loans,
    fully_repaid_loans,
    Total_Monthly_Income,
  } = req.body;
  EmptyValidation({field_of_employment,Source_of_income,Experience,Number_Of_Loans,fully_repaid_loans,Total_Monthly_Income})
  isNumber({Source_of_income,Experience,Number_Of_Loans,fully_repaid_loans,Total_Monthly_Income})
  const lastLoan = await Loan.findOne({ id: req.user.id }).sort({
    field: "asc",
    _id: -1,
  });
  if(!lastLoan)
  return next(new ErrorHandler("Loan not found",400))

  const DTI = lastLoan.Monthly_payment / Total_Monthly_Income;
  var economicScore = getEconomicScore(
    Source_of_income,
    Experience,
    Number_Of_Loans,
    DTI,
    fully_repaid_loans
  );
  const newdata = {
    field_of_employment: field_of_employment,
    Source_of_income: Source_of_income,
    Experience: Experience,
    Number_Of_Loans: Number_Of_Loans,
    DTI: DTI,
    fully_repaid_loans: fully_repaid_loans,
    Total_Monthly_Income: Total_Monthly_Income,
    economicScore: economicScore,
  };
  const economic = await Economic.findOne({ id: req.user.id });
  const eco = await Economic.findByIdAndUpdate(economic._id, newdata, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  let d;
  if(String(lastLoan.Types_of_Collateral).toLowerCase()=="car"||String(lastLoan.Types_of_Collateral).toLowerCase()=="car,building"){
  d="/car/Car/1";
  collateral="car";
  }
  else if(String(Types_of_Collateral).toLocaleLowerCase=="building"){
  d="/Building/1";
collateral="building";
}
await ApplicationSetting.updateOne({id:req.user.id},{status:collateral,next:d})  
  res.status(200).json({
    success: true,
  });
}catch(err){
  return next(new ErrorHandler(err,400))
}
});
exports.updateBEconomic = asyncErrorHandler(async (req, res,next) => {
  try{
    const {
      Number_of_Employees,
      year,
      Total_Monthly_Income,
      Number_Of_Loans,
      fully_repaid_loans,
      EBIT,
      FCBT,
    } = req.body
    EmptyValidation({Number_of_Employees,year,Total_Monthly_Income, Number_Of_Loans,fully_repaid_loans,EBIT,FCBT})
    isNumber({Number_of_Employees,year,Total_Monthly_Income,Number_Of_Loans,fully_repaid_loans,EBIT,FCBT})
  const lastLoan = await BLoanModel.findOne({ id: req.user.id }).sort({
    field: "asc",
    _id: -1,
  });
  if(!lastLoan)
  return next(new ErrorHandler("Loan not found"))
  var i =
    (lastLoan.loan_amount * lastLoan.interest * lastLoan.Loan_Payment_Period) /12;
  var FCCR = (req.body.EBIT + req.body.FCBT) / (req.body.FCBT + i);
  const DTI = req.body.Total_Monthly_Income / lastLoan.loan_amount;
  var economicScore = GetCompanyScore(Number_of_Employees,year,Number_Of_Loans,fully_repaid_loans,DTI,FCCR);
  const newdata = {
    Number_of_Employees: req.body.Number_of_Employees,
    year: req.body.year,
    Total_Monthly_Income: req.body.Total_Monthly_Income,
    Number_Of_Loans: req.body.Number_Of_Loans,
    fully_repaid_loans: req.body.fully_repaid_loans,
    Buildings: req.body.Buildings,
    Vehicles: req.body.Vehicles,
    Companies: req.body.Companies,
    EBIT: req.body.EBIT,
    FCBT: req.body.FCBT,
    FCCR: FCCR,
    economicScore: economicScore,
  };
  const beconomic = await BEconomic.findOne({ id: req.user.id });
  const eco = await BEconomic.findByIdAndUpdate(
    beconomic && beconomic._id,
    newdata,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );
  res.status(200).json({
    success: true,
  });
}catch(err){
  return next(new ErrorHandler(err,400))
}
});
