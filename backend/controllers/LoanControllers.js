const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Economic = require("../models/EconomicModel");
const Loan = require("../models/LoanModel");
const BLoan = require("../models/BLoanModel");
const Bank = require("../models/BankModel");
const BranchModel = require("../models/BranchModel");
const BEconomicModel = require("../models/BEconomicModel");
const LoginModel = require("../models/LoginModel");
const ApplicationSetting = require("../models/ApplicationSetting");
const ErrorHandler = require("../utils/errorHandler");
const {
  isNumber,
  isJobStatus,
  isLoanType,
  isCollateral,
  EmptyValidation,
  isPositive,
} = require("../utils/Validations");
const BankModel = require("../models/BankModel");
// Add
exports.addLoan = asyncErrorHandler(async (req, res, next) => {
  try {
    const {
      loan_amount,
      Reason_for_loan,
      Loan_Payment_Period,
      Job_Status,
      Bank,
      Type_Of_Loan,
      Types_of_Collateral,
      Monthly_payment,
      interest,
      branch,
    } = req.body;
    EmptyValidation({
      loan_amount,
      Reason_for_loan,
      Loan_Payment_Period,
      Job_Status,
      Bank,
      Type_Of_Loan,
      Types_of_Collateral,
      Monthly_payment,
      interest,
      branch,
    });
    isNumber({ loan_amount, Loan_Payment_Period, Monthly_payment });
    isJobStatus(Job_Status);
    isPositive({ loan_amount, Monthly_payment, interest });
    const bank = await BankModel.findOne({ bank_name: Bank });
    if (!bank && Bank)
      return next(
        new ErrorHandler(
          Bank + " is not registered in Ebidir Platform as Bank name",
          400
        )
      );
    const _branch = await BranchModel.findById(branch);
    if (!_branch && branch)
      return next(new ErrorHandler("The branch is not valid", 400));
    isLoanType(bank?.loan_types, Type_Of_Loan);
    isCollateral(Types_of_Collateral);
    const loan = await Loan.create({
      loan_amount,
      Reason_for_loan,
      Loan_Payment_Period,
      Job_Status,
      Bank,
      Type_Of_Loan,
      Types_of_Collateral,
      Monthly_payment,
      interest,
      id: req.user.id,
      Branch: branch,
    });
    var next = "";
    if (String(req.body.Types_of_Collateral).toLowerCase() == "car")
      next = "/personal/economic/Car";
    else if (req.body.Types_of_Collateral == "Car,Building")
      next = "/personal/economic/Car_Building";
    else if (req.body.Types_of_Collateral == "Building")
      next = "/personal/economic/Building";
    await ApplicationSetting.updateOne(
      { id: req.user.id },
      { status: "economic", next: next }
    );
    res.status(200).json({
      success: true,
      loan,
    });
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
// company loan
exports.addBLoan = asyncErrorHandler(async (req, res, next) => {
  try {
    const {
      loan_amount,
      Reason_for_loan,
      Loan_Payment_Period,
      Bank,
      Branch,
      Type_Of_Loan,
      Types_of_Collateral,
      Monthly_payment,
      interest,
    } = req.body;
    EmptyValidation({
      loan_amount,
      Reason_for_loan,
      Loan_Payment_Period,
      Bank,
      Branch,
      Type_Of_Loan,
      Types_of_Collateral,
      Monthly_payment,
      interest,
    });
    isNumber({ loan_amount, Loan_Payment_Period, Monthly_payment });
    isPositive({ loan_amount, Monthly_payment, interest });
    const bank = await BankModel.findOne({ bank_name: Bank });
    if (!bank && Bank)
      return next(
        new ErrorHandler(
          Bank + " is not registered in Ebidir Platform as Bank name",
          400
        )
      );
    const _branch = await BranchModel.findById(Branch);
    if (!_branch && Branch)
      return next(new ErrorHandler("The branch is not valid", 400));
    isLoanType(bank?.loan_types, Type_Of_Loan);
    isCollateral(Types_of_Collateral);
    const bloan = await BLoan.create({
      loan_amount,
      Reason_for_loan,
      Loan_Payment_Period,
      Bank,
      Type_Of_Loan,
      Types_of_Collateral,
      Monthly_payment,
      interest,
      id: req.user.id,
      Branch,
    });

    var next = "";
    if (String(req.body.Types_of_Collateral).toLowerCase() == "car")
      next = "/company/economic/Car";
    else if (req.body.Types_of_Collateral == "Car,Building")
      next = "/company/economic/Car_Building";
    else if (req.body.Types_of_Collateral == "Building")
      next = "/company/economic/Building";
    await ApplicationSetting.updateOne(
      { id: req.user.id },
      { status: "beconomic", next: next }
    );

    res.status(200).json({
      success: true,
      bloan,
    });
  } catch (err) {
    next(new ErrorHandler(err, 400));
  }
});
// get personal loan
exports.getloan = asyncErrorHandler(async (req, res, next) => {
  const myloan = await Loan.find({ id: req.user.id }).populate(
    "Branch",
    "branch_name"
  );
  res.status(200).json({
    success: true,
    myloan,
  });
});
// get bussiness loan
exports.getbloan = asyncErrorHandler(async (req, res, next) => {
  const mybloan = await BLoan.find({ id: req.user.id }).populate(
    "Branch",
    "branch_name"
  );
  res.status(200).json({
    success: true,
    mybloan,
  });
});
// get loan by ID
exports.getLoanDetail = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new ErrorHandler("Loan id is required", 400));
  let theLoan = await Loan.findOne({ _id: id });
  const bank = await Bank.findById(req.user.id);
  if (
    (req.user.role == "user" &&
      req.user.id.toString() != theLoan.id.toString()) ||
    (req.user.role == "branch" &&
      req.user.id.toString() != theLoan.Branch.toString()) ||
    (req.user.role == "bank" && bank.bank_name != theLoan.Bank)
  )
    return next(new ErrorHandler("Unauthorized loan access", 401));
  theLoan = await Loan.findOne({ _id: id }).populate("Branch", "branch_name");
  res.status(200).json({
    success: true,
    theLoan,
  });
});
// get bussness loan by Id
exports.getBLoanDetail = asyncErrorHandler(async (req, res, next) => {
  let theLoan = await BLoan.findOne({ _id: req.body.id });
  const bank = await Bank.findById(req.user.id);
  if (
    (req.user.role == "company" &&
      req.user.id.toString() != theLoan.id.toString()) ||
    (req.user.role == "branch" &&
      req.user.id.toString() != theLoan.Branch.toString()) ||
    (req.user.role == "bank" && bank.bank_name != theLoan.Bank)
  )
    return next(new ErrorHandler("Unauthorized loan access", 401));

  theLoan = await BLoan.findOne({ _id: req.body.id }).populate(
    "Branch",
    "branch_name"
  );

  res.status(200).json({
    success: true,
    theLoan,
  });
});
// for bank
exports.getLoanByBankName = asyncErrorHandler(async (req, res, next) => {
  const id = req.user.id;
  const bank = await Bank.findOne({ _id: id });
  const bankLoan = await Loan.find({ Bank: bank && bank.bank_name }).populate(
    "Branch",
    "branch_name"
  );

  res.status(200).json({
    bankLoan,
    success: true,
  });
});
exports.getLoanByBranch = asyncErrorHandler(async (req, res, next) => {
  const id = req.user.id;
  const branchLoan = await Loan.find({ Branch: id }).populate(
    "Branch",
    "branch_name"
  );
  res.status(200).json({
    branchLoan,
    success: true,
  });
});
exports.getBLoanByBranchName = asyncErrorHandler(async (req, res, next) => {
  const id = req.user.id;
  const branchBLoan = await BLoan.find({ Branch: id }).populate(
    "Branch",
    "branch_name"
  );
  res.status(200).json({
    branchBLoan,
    success: true,
  });
});
exports.getBLoanByBankName = asyncErrorHandler(async (req, res, next) => {
  const id = req.user.id;
  const bank = await Bank.findOne({ _id: id });
  const bankBLoan = await BLoan.find({ Bank: bank && bank.bank_name });
  res.status(200).json({
    bankBLoan,
    success: true,
  });
});
// for Admin
exports.getAllLoan = asyncErrorHandler(async (req, res, next) => {
  const loans = await Loan.find().populate("Branch", "branch_name");

  res.status(200).json({
    success: true,
    loans,
  });
});
exports.getAllBLoan = asyncErrorHandler(async (req, res, next) => {
  const bloans = await BLoan.find().populate("Branch", "branch_name");
  res.status(200).json({
    success: true,
    bloans,
  });
});
//last loan
exports.getLastEntry = asyncErrorHandler(async (req, res, next) => {
  const lastLoan = await Loan.findOne().sort({ field: "asc", _id: -1 });
  res.status(200).json({
    success: true,
    lastLoan,
  });
});
// for bank
exports.updateLoan = asyncErrorHandler(async (req, res, next) => {
  try {
    const { status } = req.body;
    EmptyValidation({ status });
    const loan = await Loan.findById(req.body.id);
    if (!loan) throw new Error("Loan does not exits");
    const economic = await Economic.findOne({ id: loan.id }); // get economic info from id
    const login = await LoginModel.findById(req.user._id);
    let bank;
    if (login.role !== "bank" && login.role !== "branch")
      throw new Error("Only Bank can update loan status");
    if (login.role == "bank") {
      bank = await BankModel.findById(req.user.id);
    } else if (login.role == "branch") {
      bank = await BranchModel.findById(req.user.id);
    }
    let bankName = bank.bank_name;
    if (loan.Bank != bankName)
      throw new Error(
        "The Loan only be updated by the bank the loan applied to"
      );
    // if parameter is Approved and orginal status is not Approved
    if (
      !["approved", "declined", "pending", "Closed"].includes(req.body.status)
    )
      throw new Error(req.body.status + " is not valid loan status");
    if (loan.status == req.body.status)
      throw new Error("Loan is already in " + req.body.status + " status");
    if (req.body.status == "Approved" && loan.status != "Approved")
      economic.Number_Of_Loans = economic.Number_Of_Loans + 1;
    //if status was approved and changed to something else
    if (loan.status == "Approved" && req.body.status !== "Approved")
      economic.Number_Of_Loans = economic.Number_Of_Loans - 1;
    // if parameter is closed and status was not closed
    if (loan.status === "pending" && req.body.status === "Closed") {
      return next(new Error("Cannot update from pending to closed"));
    }
    const isFullyPaid =
      loan.paidMonths && loan.paidMonths.length >= loan.Loan_Payment_Period;
    if (
      loan.status === "approved" &&
      req.body.status === "Closed" &&
      !isFullyPaid
    ) {
      return next(
        new Error("Loan Needs To be Amortized before Changing its Status")
      );
    }
    // Check if current status is closed
    if (loan.status === "Closed") {
      return next(new Error("Cannot update closed loan"));
    }
    if (loan.status == "Closed" && req.body.status !== "Closed")
      economic.fully_repaid_loans = economic.fully_repaid_loans - 1;
    // if parameter is closed and status was not closed
    if (req.body.status == "Closed" && loan.status != "Closed")
      economic.fully_repaid_loans = economic.fully_repaid_loans + 1;
    loan.status = req.body.status;
    await Loan.findByIdAndUpdate(
      { _id: req.body.id },
      { status: req.body.status }
    );
    res.status(201).json({
      success: true,
      message: "Loan Updated",
    });
  } catch (err) {
    next(new ErrorHandler(err, 400));
  }
});
exports.updateAmortizationLoan = asyncErrorHandler(async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.body.id);
    if (!loan) throw new Error("Loan does not exits");
    if (loan.status == "pending" || loan.status == "Declined") {
      res.status(400).json({
        success: true,
        message: "Loan is not approved Yet or declined ",
      });
    } else {
      const months = loan.paidMonths;
      if (months.includes(req.body.month))
        throw new Error("The month is already ammortized");
      const login = await LoginModel.findById(req.user._id);
      let bank;
      if (login.role !== "bank" && login.role !== "branch")
        throw new Error("Only Bank can ammortize loan");
      if (login.role == "bank") {
        bank = await BankModel.findById(req.user.id);
      } else if (login.role == "branch") {
        bank = await BranchModel.findById(req.user.id);
      }
      let bankName = bank.bank_name;
      if (loan.Bank != bankName)
        throw new Error(
          "The Loan only amortized by the bank the loan applied to"
        );
      const dateRegex = /^[a-zA-Z]{3}\s\d{4}$/;
      if (!dateRegex.test(req.body.month))
        throw new Error("The date format is not valid");
      months.push(req.body.month);
      loan.paidMonths = months;
      loan.save();
      res.status(201).json({
        success: true,
        message: "Loan Updated",
      });
    }
  } catch (err) {
    next(new ErrorHandler(err, 400));
  }
});
exports.updateAmortizationBLoan = asyncErrorHandler(async (req, res, next) => {
  const loan = await BLoan.findById(req.body.id);
  if (!loan) next(new ErrorHandler("Loan does not exits", 400));
  if (loan.status == "pending" || loan.status == "Declined") {
    res.status(400).json({
      success: true,
      message: "Loan is not approved Yet or declined ",
    });
  } else {
    const months = loan.paidMonths;
    if (months.includes(req.body.month))
      next(new ErrorHandler("The month is already ammortized", 400));
    const login = await LoginModel.findById(req.user._id);
    let bank;
    if (login.role !== "bank" && login.role !== "branch")
      next(new ErrorHandler("Only Bank can ammortize loan", 400));
    if (login.role == "bank") {
      bank = await BankModel.findById(req.user.id);
    } else if (login.role == "branch") {
      bank = await BranchModel.findById(req.user.id);
    }
    let bankName = bank.bank_name;
    if (loan.Bank != bankName)
      next(
        new ErrorHandler(
          "The Loan only amortized by the bank the loan applied to",
          400
        )
      );
    const dateRegex = /^[a-zA-Z]{3}\s\d{4}$/;
    if (!dateRegex.test(req.body.month))
      next(new ErrorHandler("The date format is not valid", 400));
    months.push(req.body.month);
    loan.paidMonths = months;
    loan.save();
    res.status(201).json({
      success: true,
      message: "Loan Updated",
    });
  }
});
exports.updateBLoan = asyncErrorHandler(async (req, res, next) => {
  try {
    const loan = await BLoan.findById(req.body.id);
    if (!loan) throw new Error("Loan does not exits");
    const economic = await BEconomicModel.findOne({ id: loan.id });
    const login = await LoginModel.findById(req.user._id);
    let bank;
    if (login.role !== "bank" && login.role !== "branch")
      throw new Error("Only Bank can ammortize loan");
    if (login.role == "bank") {
      bank = await BankModel.findById(req.user.id);
    } else if (login.role == "branch") {
      bank = await BranchModel.findById(req.user.id);
    }
    let bankName = bank.bank_name;
    if (loan.Bank != bankName)
      throw new Error(
        "The Loan only amortized by the bank the loan applied to"
      );
    // if parameter is Approved and orginal status is not Approved
    if (
      !["approved", "declined", "pending", "Closed"].includes(req.body.status)
    )
      next(new ErrorHandler(req.body.status + " is not valid status"));

    const isFullyPaid =
      loan.paidMonths && loan.paidMonths.length >= loan.Loan_Payment_Period;
    if (
      loan.status === "approved" &&
      req.body.status === "Closed" &&
      !isFullyPaid
    ) {
      return next(
        new Error("Loan Needs To be Amortized before Changing its Status")
      );
    }
    // if parameter is Approved and orginal status is not Approved
    if (req.body.status == "Approved" && loan.status != "Approved")
      economic.Number_Of_Loans = economic.Number_Of_Loans + 1;
    //if status was approved and changed to something else
    if (loan.status == "Approved" && req.body.status !== "Approved")
      economic.Number_Of_Loans = economic.Number_Of_Loans - 1;
    // if parameter is closed and status was not closed
    if (loan.status === "pending" && req.body.status === "Closed") {
      return next(new Error("Cannot update from pending to closed"));
    }

    // Check if current status is closed
    if (loan.status === "Closed") {
      return next(new Error("Cannot update closed loan"));
    }
    if (loan.status == "Closed" && req.body.status !== "Closed")
      economic.fully_repaid_loans = economic.fully_repaid_loans - 1;
    // if parameter is closed and status was not closed
    if (req.body.status == "Closed" && loan.status != "Closed")
      economic.fully_repaid_loans = economic.fully_repaid_loans + 1;

    loan.status = req.body.status;
    loan.save();
    res.status(201).json({
      success: true,
      message: "Loan Updated",
    });
  } catch (err) {
    next(new ErrorHandler(err, 400));
  }
});
