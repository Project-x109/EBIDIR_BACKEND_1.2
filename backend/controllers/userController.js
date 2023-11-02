const User = require("../models/userModel");
const Personal = require("../models/PersonalModel");
const Economic = require("../models/EconomicModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const sendToken = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const Company = require("../models/BussinessModel");
const Bank = require("../models/BankModel");
const Agent = require("../models/AgentsModel");
const Branch = require("../models/BranchModel");
const Login = require("../models/LoginModel");
const brain = require("brain.js");
const fs = require("fs");
const {
  emailExists,
  phoneExists,
  TINExists,
} = require("../middlewares/validator");
const userModel = require("../models/userModel");
const BussinessModel = require("../models/BussinessModel");
const BankModel = require("../models/BankModel");
const BranchModel = require("../models/BranchModel");
const {
  AccountCreated,
  AccountReactivated,
  AccountDeactivated,
} = require("./EmailControllers");
const { Logger } = require("./SystemController");
const { default: isEmail } = require("validator/lib/isEmail");
const {
  isPhone,
  EmptyValidation,
  isGender,
  isBank,
} = require("../utils/Validations");
const { SECTOR } = require("../middlewares/Dataset");
const AgentsModel = require("../models/AgentsModel");
const { Mongoose } = require("mongoose");
// Login User
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { phoneNo, password } = req.body;
  try {
   
    if (!phoneNo || !password) {
      return next(new ErrorHandler("Please Enter phone And Password", 400));
    }
    isPhone(phoneNo);
    const login = await Login.findOne({ phoneNo }).select("+password");
    if (!login) {
      Logger({ user: phoneNo, operation: "Login attempt with wrong phone" });
      return next(new ErrorHandler("Invalid phone No or Password", 401));
    }
    const isPasswordMatched = await login.comparePassword(password);
    if (login.status == "inactive") {
      Logger({
        user: login._id,
        operation: "Login attempt with inactive account",
        link: "",
      });
      return next(
        new ErrorHandler("Account is dormant Contact Administrator", 401)
      );
    }
    if (!isPasswordMatched) {
      login.login_attempt = login.login_attempt + 1;
      const attempt = login.login_attempt;
      if (login.login_attempt >= 3) {
        login.login_attempt = 0;
        const user = await User.findById(login.id);
        const company = await Company.findById(login.id);
        const bank = await Bank.findById(login.id);
        const branch = await BranchModel.findById(login.id);
        const agent = await Agent.findById(login.id);
        const USER = "user";
        const COMPANY = "company";
        const BANK = "bank";
        const BRANCH = "branch";
        const AGENT = "agent";

        const role = login.role;
        switch (role) {
          case USER:
            user.status = "inactive";
            await user.save();
            break;
          case COMPANY:
            company.status = "inactive";
            await company.save();
            break;
          case BANK:
            bank.status = "inactive";
            await bank.save();
            break;
          case BRANCH:
            branch.status = "inactive";
            await branch.save();
            break;
          case AGENT:
            agent.status = "inactive";
            await agent.save();
        }
        login.status = "inactive";
      }
      login.save();
      return next(
        new ErrorHandler(
          "Invalid phone No or Password\n" +
            (attempt != 3
              ? 3 - login.login_attempt + " Tries Left"
              : "Account Blocked"),
          401
        )
      );
    }
    login.login_attempt = 0;
    login.save();
    Logger({ user: login._id, operation: "Login", link: "" });
    sendToken(login, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
// logout user
exports.logoutUser = asyncErrorHandler(async (req, res) => {
  Logger({ user: req.user.id, operation: "Logout", link: "" });
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
// Add user
exports.AddUsers = asyncErrorHandler(async (req, res, next) => {
  try {
    const { name, email, gender, phoneNo, TIN_Number, password } = req.body;
    EmptyValidation({ name,gender, phoneNo, password });
    if(!isGender(gender))
    return next(new ErrorHandler("Gender is not valid", 400));
    isPhone(phoneNo);
    if (email&&!isEmail(email))
      return next(new ErrorHandler("Email is not valid", 400));
    if (TIN_Number&&TIN_Number.length < 5)
      return next(new ErrorHandler("Tin number is not valid", 400));
    if (password.length < 8 || password.length > 100)
      return next(new ErrorHandler("Password is not valid", 400));
    const users = await userModel.find();
    const companies = await BussinessModel.find();
    const banks = await BankModel.find();
    const branches = await BranchModel.find();
    const agents = await AgentsModel.find();
    let scannedFiles = [];
    if (typeof req.body.scannedFiles === "string") {
      scannedFiles.push(req.body.scannedFiles);
    } else {
      scannedFiles = req.body.scannedFiles;
    }
    const scannedFilesLink = [];
    for (let i = 0; i < scannedFiles?.length; i++) {
      const result = await cloudinary.v2.uploader.upload(scannedFiles[i], {
        folder: "ScannedFiles",
      });
      scannedFilesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    let profile = "";
    if (req.body.profile) {
      const result = await cloudinary.v2.uploader.upload(req.body.profile, {
        folder: "profile",
      });
      profile = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    req.body.profile = profile;
    req.body.scannedFiles = scannedFilesLink;
    req.body.createdBy = req.user.id;
    req.body.createdRole = req.user.role;
    const emailunique = emailExists(
      users,
      companies,
      banks,
      branches,
      agents,
      req.body.email
    );
    const phoneUnique = phoneExists(users, companies, banks, req.body.phoneNo);
    const TINunique = TINExists(users, companies, req.body.CTIN_Number);
    if (emailunique && phoneUnique && TINunique) {
      const newuser = await User.create(req.body);
      const newlogin = await Login.create({
        id: newuser._id,
        phoneNo: req.body.phoneNo,
        password: req.body.password,
        role: "user",
      });
      AccountCreated({ email: req.body.email, name: req.body.name });
      Logger({
        user: req.user.id,
        operation: "Account created",
        link: newlogin.id,
      });
      res.status(201).json({
        success: true,
        newuser,
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          (emailunique ? "" : "Email Account Exists  ") +
          (phoneUnique ? "" : "Phone Number Exists") +
          (TINunique ? "" : "TIN Number Exists"),
      });
    }
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
exports.AddAgent = asyncErrorHandler(async (req, res, next) => {
  try {
    const { name, email, gender, phoneNo, password } = req.body;
    EmptyValidation({ name, email, gender, phoneNo, password });
    isGender(gender);
    isPhone(phoneNo);
    if (!isEmail(email))
      return next(new ErrorHandler("Email is not valid", 400));
    if (password.length < 8 || password.length > 100)
      return next(new ErrorHandler("Password is not valid", 400));
    const users = await userModel.find();
    const companies = await BussinessModel.find();
    const banks = await BankModel.find();
    const branches = await BranchModel.find();
    const agents = await AgentsModel.find();

    let profile = "";
    if (req.body.profile) {
      const result = await cloudinary.v2.uploader.upload(req.body.profile, {
        folder: "profile",
      });
      profile = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    req.body.profile = profile;
    const emailunique = emailExists(
      users,
      companies,
      banks,
      branches,
      agents,
      req.body.email
    );
    const phoneUnique = phoneExists(users, companies, banks, req.body.phoneNo);
    if (emailunique && phoneUnique) {
      const newagent = await AgentsModel.create(req.body);
      const newlogin = await Login.create({
        id: newagent._id,
        phoneNo: req.body.phoneNo,
        password: req.body.password,
        role: "agent",
      });
      AccountCreated({ email: req.body.email, name: req.body.name });
      Logger({
        user: req.user.id,
        operation: "Account created",
        link: newlogin.id,
      });
      res.status(201).json({
        success: true,
        newagent,
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          (emailunique ? "" : "Email Account Exists  ") +
          (phoneUnique ? "" : "Phone Number Exists"),
      });
    }
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
// Add Company
exports.AddCompany = asyncErrorHandler(async (req, res, next) => {
  try {
    const {
      cname,
      cemail,
      General_Manager,
      cphoneNo,
      CTIN_Number,
      legal_status,
      sector,
      compassword,
    } = req.body;
    EmptyValidation({
      cname,
      cemail,
      General_Manager,
      cphoneNo,
      CTIN_Number,
      legal_status,
      sector,
      compassword,
    });
    if (isPhone(req.body.cphoneNo) !== true)
      return next(new ErrorHandler("Phone is Invalid"));
    if (!isEmail(req.body.cemail))
      return next(new ErrorHandler("Email is Invalid"));
    if (
      ![
        "Sole Proprietorship",
        "General Partnership",
        "Limited Liability Company (LLC)",
        "Corporations",
      ].includes(req.body.legal_status)
    )
      return next(
        new ErrorHandler(legal_status + " is not valid Legal status")
      );
    if (!SECTOR.includes(req.body.sector))
      return next(
        new ErrorHandler(req.body.sector + " is not valid sector type")
      );
    const users = await userModel.find();
    const companies = await BussinessModel.find();
    const banks = await BankModel.find();
    const branches = await BranchModel.find();
    const agents = await AgentsModel.find();
    let scannedFiles = [];

    if (typeof req.body.scannedFiles === "string") {
      scannedFiles.push(req.body.scannedFiles);
    } else if (req.body.scannedFiles != undefined) {
      scannedFiles = req.body.scannedFiles;
    }
    const scannedFilesLink = [];
    for (let i = 0; i < scannedFiles.length; i++) {
      const result = await cloudinary.v2.uploader.upload(scannedFiles[i], {
        folder: "ScannedFiles",
      });
      scannedFilesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    let logo = "";
    if (req.body.logo) {
      const result = await cloudinary.v2.uploader.upload(req.body.logo, {
        folder: "logo",
      });
      logo = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    req.body.logo = logo;
    req.body.scannedFiles = scannedFilesLink;
    req.body.createdBy = req.user.id;
    req.body.createdRole = req.user.role;
    const emailunique = emailExists(
      users,
      companies,
      banks,
      branches,
      agents,
      req.body.cemail
    );
    const phoneUnique = phoneExists(users, companies, banks, req.body.cphoneNo);
    const TINunique = TINExists(users, companies, req.body.CTIN_Number);
    if (emailunique && phoneUnique && TINunique) {
      const newcompany = await Company.create(req.body);
      const newlogin = await Login.create({
        id: newcompany._id,
        phoneNo: req.body.cphoneNo,
        password: req.body.compassword,
        role: "company",
      });
      Logger({
        user: req.user.id,
        operation: "Bussiness Account created",
        link: newlogin.id,
      });
      AccountCreated({
        email: req.body.cemail,
        name: req.body.General_Manager,
      });
      res.status(201).json({
        success: true,
        newcompany,
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          (emailunique ? "" : "Email Account Exists  ") +
          (phoneUnique ? "" : "Phone Number Exists") +
          (TINunique ? "" : "TIN Number Exists"),
      });
    }
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
//Add Bank
exports.AddBank = asyncErrorHandler(async (req, res, next) => {
  try {
    const { bank_name, bank_email, bank_phoneNo, bank_password } = req.body;
    EmptyValidation({ bank_name, bank_email, bank_phoneNo, bank_password });
    if (!isEmail(req.body.bank_email))
      return next(new ErrorHandler("Email is Invalid"));
    if (isPhone(bank_phoneNo) !== true)
      return next(new ErrorHandler("Phone is Invalid"));
    if (bank_password.length < 8 || bank_password.length > 100)
      return next(new ErrorHandler("Password is not valid", 400));
    const users = await userModel.find();
    const companies = await BussinessModel.find();
    const banks = await BankModel.find();
    const branches = await BranchModel.find();
    const agents = await AgentsModel.find();
    let result;
    if (req.body.logo) {
      result = await cloudinary.v2.uploader.upload(req.body.logo, {
        folder: "logo",
      });
      let logo = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      req.body.logo = logo;
    }
    const emailunique = emailExists(
      users,
      companies,
      banks,
      branches,
      agents,
      req.body.bank_email
    );
    const phoneUnique = phoneExists(
      users,
      companies,
      banks,
      req.body.bank_phoneNo
    );
    const message =
      emailunique == true
        ? ""
        : "Email Account Exists  " + phoneUnique == true
        ? ""
        : "Phone Number Exists";
    if (emailunique) {
      if (phoneUnique) {
        const newbank = await Bank.create(req.body);
        const newlogin = await Login.create({
          id: newbank._id,
          phoneNo: req.body.bank_phoneNo,
          password: req.body.bank_password,
          role: "bank",
        });
        AccountCreated({
          email: req.body.bank_email,
          name: req.body.bank_name,
        });
        Logger({
          user: req.user.id,
          operation: "Bank Account created",
          link: newlogin.id,
        });
        res.status(201).json({
          success: true,
          newbank,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Phone Number Exists",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Email Account Exists ",
      });
    }
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
//Add Branch
exports.AddBranch = asyncErrorHandler(async (req, res, next) => {
  try {
    const {
      bank_name,
      branch_name,
      branch_email,
      branch_phoneNo,
      location,
      manager,
      branch_password,
    } = req.body;

    EmptyValidation({
      bank_name,
      branch_name,
      branch_email,
      branch_phoneNo,
      location,
      manager,
      branch_password,
    });

    if (!isEmail(req.body.branch_email))
      return next(new ErrorHandler("Email is Invalid"));
    if (isPhone(branch_phoneNo) !== true)
      return next(new ErrorHandler("Phone is Invalid"));
    isBank(bank_name);
    if (branch_password.length < 8 || branch_password.length > 100)
      return next(new ErrorHandler("Password is not valid", 400));

    const users = await userModel.find();
    const companies = await BussinessModel.find();
    const banks = await BankModel.find();
    const branches = await BranchModel.find();
    const agents = await AgentsModel.find();

    const emailunique = emailExists(
      users,
      companies,
      banks,
      branches,
      agents,
      req.body.branch_email
    );
    const phoneUnique = phoneExists(
      users,
      companies,
      banks,
      req.body.branch_phoneNo
    );
    const message =
      emailunique == true
        ? ""
        : "Email Account Exists  " + phoneUnique == true
        ? ""
        : "Phone Number Exists";
    if (emailunique) {
      if (phoneUnique) {
        req.body.branch_code = "EbidirAma" + ((Math.random() * 10000) % 10000);
        const newbranch = await BranchModel.create(req.body);

        const newlogin = await Login.create({
          id: newbranch._id,
          phoneNo: req.body.branch_phoneNo,
          password: req.body.branch_password,
          role: "branch",
        });

        AccountCreated({
          email: req.body.branch_email,
          name: req.body.branch_name,
        });
        Logger({
          user: req.user.id,
          operation: "Bank branch Account created",
          link: newlogin.id,
        });
        res.status(201).json({
          success: true,
          newbranch,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Phone Number Exists",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Email Account Exists ",
      });
    }
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
// Get User Details
exports.getUserDetails = asyncErrorHandler(async (req, res) => {
  const login = await Login.findOne({ id: req.user.id });
  res.status(200).json({
    success: true,
    login,
  });
});
exports.getAdminUserDetails = asyncErrorHandler(async (req, res) => {
  const login = await Login.findOne({ id: req.user.id });
  res.status(200).json({
    success: true,
    login,
  });
});
exports.getUser = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
exports.getCompany = asyncErrorHandler(async (req, res) => {
  const company = await Company.findOne({ _id: req.user.id });
  res.status(200).json({
    company,
    success: true,
  });
});

exports.getUserById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return next(new ErrorHandler("Id is required", 400));
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
});
exports.getCompanyById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return next(new ErrorHandler("Id is required", 400));
  const thecompany = await Company.findById(id);
  res.status(200).json({
    thecompany,
    success: true,
  });
});
exports.getBank = asyncErrorHandler(async (req, res) => {
  const mybank = await Bank.findOne({ _id: req.user.id });
  res.status(200).json({
    mybank,
    success: true,
  });
});

exports.getBranch = asyncErrorHandler(async (req, res) => {
  const mybranch = await BranchModel.findOne({ _id: req.user.id });
  res.status(200).json({
    mybranch,
    success: true,
  });
});
exports.getBranchByBank = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.bank_name)
    return next(new ErrorHandler("Bank name is required", 400));
  const bankBranches = await BranchModel.find({
    bank_name: req.body.bank_name,
  });
  res.status(200).json({
    bankBranches,
    success: true,
  });
});
exports.getBankByBranch = asyncErrorHandler(async (req, res, next) => {
  const branch = await BranchModel.findById(req.user.id);
  if (!branch) return next(new ErrorHandler("Branch not found"));
  const mybranchbank = await Bank.findOne({ bank_name: branch?.bank_name });
  res.status(200).json({
    mybranchbank,
    success: true,
  });
});
exports.getMyBranches = asyncErrorHandler(async (req, res, next) => {
  const bank = await Bank.findById(req.user.id);
  if (!bank) return next(new ErrorHandler("Bank not found in the system"));
  const myBankBranches = await BranchModel.find({ bank_name: bank.bank_name });
  res.status(200).json({
    myBankBranches,
    success: true,
  });
});
exports.getAllBranches = asyncErrorHandler(async (req, res) => {
  const branches = await BranchModel.find();
  res.status(200).json({
    branches,
    success: true,
  });
});
exports.Rank = (score) => {
  let network = new brain.recurrent.LSTM();
  const networkState = JSON.parse(
    fs.readFileSync("network_state.json", "utf-8")
  );
  network.fromJSON(networkState);
  const output = network.run("" + parseInt(score));
  return output;
};
exports.deleteAccount = asyncErrorHandler(async (req, res) => {
  const login = await Login.findOne({ id: req.user.id });
  const user = await User.findById(req.user.id);
  const company = await Company.findById(req.user.id);
  const bank = await Bank.findById(req.user.id);
  const USER = "user";
  const COMPANY = "company";
  const BANK = "bank";
  const role = login.role;
  switch (role) {
    case USER:
      user.status = "inactive";
      await user.save();
      break;
    case COMPANY:
      company.status = "inactive";
      await company.save();
      break;
    case BANK:
      bank.status = "inactive";
      await bank.save();
      break;
  }
  login.status = "inactive";
  await login.save();
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Account Deactivated",
  });
});
exports.AdminDeleteAccount = asyncErrorHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    EmptyValidation(id);
    const login = await Login.findOne({ id }).select("+password");
    if (login == null) {
      return next(new ErrorHandler("Account not found in the system", 400));
    }
    const user = await User.findById(req.body.id);
    const company = await Company.findById(req.body.id);
    const bank = await Bank.findById(req.body.id);
    const agent = await Agent.findById(req.body.id);
    const branch = await Branch.findById(req.body.id);
    const USER = "user";
    const COMPANY = "company";
    const BANK = "bank";
    const AGENT = "agent";
    const BRANCH = "branch";
    var name = "";
    var email = "";
    const role = login.role;
    switch (role) {
      case USER:
        user.status = "inactive";
        name = user.name;
        email = user.email;
        await user.save();
        break;
      case COMPANY:
        company.status = "inactive";
        name = company.cname;
        email = company.cemail;
        await company.save();
        break;
      case BANK:
        name = bank.bank_name;
        email = bank.bank_email;
        bank.status = "inactive";
        await bank.save();
        break;
      case AGENT:
        name = agent.name;
        email = agent.email;
        agent.status = "inactive";
        await agent.save();
        break;
      case BRANCH:
        name = branch.branch_name;
        email = branch.branch_email;
        branch.status = "inactive";
        await branch.save();
        break;
    }
    login.status = "inactive";
    await login.save();
    AccountDeactivated({ email: email, name: name, reason: req.body.reason });
    res.status(200).json({
      success: true,
      message: "Account Deactivated",
    });
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
exports.BackendAccountDelete = (data) => async () => {
  const login = await Login.findOne({ id: data.id });
  const user = await User.findById(data.id);
  const company = await Company.findById(data.id);
  const bank = await Bank.findById(data.id);
  const agent = await Agent.findById(req.body.id);
  const branch = await Branch.findById(req.body.id);
  const USER = "user";
  const COMPANY = "company";
  const BANK = "bank";
  const AGENT = "agent";
  const BRANCH = "branch";
  var name = "";
  var email = "";
  const role = login.role;
  switch (role) {
    case USER:
      user.status = "inactive";
      name = user.name;
      email = user.email;
      await user.save();
      break;
    case COMPANY:
      company.status = "inactive";
      name = company.cname;
      email = company.cemail;
      await company.save();
      break;
    case BANK:
      name = bank.bank_name;
      email = bank.bank_email;
      bank.status = "inactive";
      await bank.save();
      break;
    case AGENT:
      agent.status = "inactive";
      name = agent.name;
      email = agent.email;
      await agent.save();
      break;
    case BRANCH:
      name = branch.branch_name;
      email = branch.branch_email;
      branch.status = "inactive";
      await branch.save();
      break;
  }
  login.status = "inactive";
  await login.save();
  AccountDeactivated({
    email: data.email,
    name: data.name,
    reason: data.reason,
  });
  res.status(200).json({
    success: true,
    message: "Account Deactivated",
  });
};
exports.Activate = asyncErrorHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    EmptyValidation(id);
    const login = await Login.findOne({ id }).select("+password");
    if (!login)
      return next(new ErrorHandler("Account not found in the system", 404));
    const user = await User.findById(req.body.id);
    const company = await Company.findById(req.body.id);
    const bank = await Bank.findById(req.body.id);
    const agent = await Agent.findById(req.body.id);
    const branch = await Branch.findById(req.body.id);
    const USER = "user";
    const COMPANY = "company";
    const BANK = "bank";
    const AGENT = "agent";
    const BRANCH = "branch";
    var name = "";
    var email = "";
    const role = login.role;
    switch (role) {
      case USER:
        user.status = "active";
        name = user.name;
        email = user.email;
        await user.save();
        break;
      case COMPANY:
        company.status = "active";
        name = company.cname;
        email = company.cemail;
        await company.save();
        break;
      case BANK:
        name = bank.bank_name;
        email = bank.bank_email;
        bank.status = "active";
        await bank.save();
        break;
      case AGENT:
        name = agent.name;
        email = agent.email;
        agent.status = "active";
        await agent.save();
        break;
      case BRANCH:
        name = branch.branch_name;
        email = branch.branch_email;
        branch.status = "active";
        await branch.save();
        break;
    }
    login.status = "active";
    await login.save();
    AccountReactivated({ email: email, name: name });
    res.status(200).json({
      success: true,
      message: "Account Reactivated",
    });
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
// Update User Profile
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
  try {
    const { name, email, phoneNo, gender } = req.body;
    EmptyValidation({ name, email, phoneNo, gender });
    isGender(gender);
    if (isPhone(phoneNo) !== true)
      return next(new ErrorHandler("Phone is Invalid"));
    if (!isEmail(email)) return next(new ErrorHandler("Email is Invalid"));
    const newUserData = {
      name: name,
      email: email,
      phoneNo: phoneNo,
      gender: gender,
    };
    await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    });
    const login = await Login.findById(req.user._id);
    login.phoneNo = req.body.phoneNo;
    login.save();
    sendToken(login, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
exports.updateProfileBank = asyncErrorHandler(async (req, res, next) => {
  try {
    const { bank_name, bank_email, bank_phoneNo } = req.body;
    EmptyValidation({ bank_name, bank_email, bank_phoneNo });
    if (!isEmail(req.body.bank_email))
      return next(new ErrorHandler("Email is Invalid"));
    if (isPhone(bank_phoneNo) !== true)
      return next(new ErrorHandler("Phone is Invalid"));
    const newUserData = {
      bank_name: bank_name,
      bank_email: bank_email,
      bank_phoneNo: bank_phoneNo,
    };
    await Bank.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    });
    const login = await Login.findById(req.user._id);
    login.phoneNo = bank_phoneNo;
    login.save();
    sendToken(login, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
exports.getLoanType = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.bank) return next(new ErrorHandler("Bank name is required"));
  const bank = await Bank.findOne({ bank_name: req.body.bank });
  const types = bank.loan_types;
  res.status(200).json({
    loantype: types,
    success: true,
  });
});
exports.updateProfileBusy = asyncErrorHandler(async (req, res, next) => {
  try {
    const {
      cname,
      cemail,
      cphoneNo,
      CTIN_Number,
      legal_status,
      sector,
      General_Manager,
    } = req.body;
    // EmptyValidation({
    //   cname,
    //   cemail,
    //   cphoneNo,
    //   CTIN_Number,
    //   legal_status,
    //   sector,
    //   General_Manager,
    // });
    if (req.body.cemail && !isEmail(req.body.cemail))
      return next(new ErrorHandler("Email is Invalid"));
    if (
      req.body.legal_status &&
      ![
        "Sole Proprietorship",
        "General Partnership",
        "Limited Liability Company (LLC)",
        "Corporations",
      ].includes(req.body.legal_status)
    )
      return next(
        new ErrorHandler(legal_status + " is not valid Legal status")
      );
    if (req.body.sector && !SECTOR.includes(req.body.sector))
      return next(new ErrorHandler(sector + " is not valid sector type"));
    if (cphoneNo && isPhone(cphoneNo) !== true)
      return next(new ErrorHandler("Phone is Invalid"));
    const comp = await Company.findById(req.user.id);
    const newUserData = {
      cname: cname ? cname : comp.cname,
      cemail: cemail ? cemail : comp.cemail,
      cphoneNo: cphoneNo ? cphoneNo : comp.cphoneNo,
      CTIN_Number: CTIN_Number ? CTIN_Number : comp.CTIN_Number,
      legal_status: legal_status ? legal_status : comp.legal_status,
      sector: sector ? sector : comp.sector,
      General_Manager: General_Manager ? General_Manager : comp.General_Manager,
    };
    await Company.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    });
    const login = await Login.findById(req.user._id);
    login.phoneNo = req.body.cphoneNo;
    login.save();
    sendToken(login, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
// ADMIN DASHBOARD
// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
exports.getAllAgents = asyncErrorHandler(async (req, res) => {
  const agents = await AgentsModel.find();
  res.status(200).json({
    success: true,
    agents,
  });
});
exports.getAllBanks = asyncErrorHandler(async (req, res) => {
  const banks = await Bank.find();

  res.status(200).json({
    success: true,
    banks,
  });
});
exports.getAllCompanies = asyncErrorHandler(async (req, res) => {
  const companies = await Company.find();

  res.status(200).json({
    success: true,
    companies,
  });
});
// Get Single User Details --ADMIN
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with id: ${id}`, 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// Update User Role --ADMIN
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {
  try {
    const { name, email, phoneNo, role, gender } = req.body;
    // EmptyValidation({ name, email, role, phoneNo, gender });
    if (gender) isGender(gender);
    if (
      role &&
      !["admin", "user", "company", "agent", "bank", "branch"].includes(role)
    )
      return next(new ErrorHandler(role + " is not Invalid role", 400));
    if (phoneNo && isPhone(phoneNo) !== true)
      return next(new ErrorHandler("Phone is Invalid", 400));
    if (email && !isEmail(email))
      return next(new ErrorHandler("Email is Invalid", 400));
    const newUserData = {
      name: name,
      email: email,
      phoneNo: phoneNo,
      gender: gender,
      role: role,
    };
    await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
exports.updateCompany = asyncErrorHandler(async (req, res, next) => {
  console.log(req.headers["user-agent"]);
  try {
    const {
      cname,
      cemail,
      cphoneNo,
      CTIN_Number,
      legal_status,
      sector,
      General_Manager,
    } = req.body;

    const login = await Login.findOne({ phoneNo: cphoneNo });
    if (login) return next(new ErrorHandler("Phone number is in use"));
    if (req.body.cemail && !isEmail(req.body.cemail))
      return next(new ErrorHandler("Email is Invalid"));
    if (
      req.body.legal_status &&
      ![
        "Sole Proprietorship",
        "General Partnership",
        "Limited Liability Company (LLC)",
        "Corporations",
      ].includes(req.body.legal_status)
    )
      return next(
        new ErrorHandler(legal_status + " is not valid Legal status")
      );
    if (req.body.sector && !SECTOR.includes(req.body.sector))
      return next(new ErrorHandler(sector + " is not valid sector type"));
    if (cphoneNo && isPhone(cphoneNo) !== true)
      return next(new ErrorHandler("Phone is Invalid"));
    if (req.body.cemail && !isEmail(req.body.cemail))
      return next(new ErrorHandler("Email is Invalid"));

    await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
// Delete Role --ADMIN
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return ErrorHandler("User id is required", 404);
  const user = await User.findById(id);
  const personal = await Personal.findOne({ id: id });
  const economic = await Economic.findOne({ id: id });
  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with id: ${id}`, 404));
  }
  if (personal) {
    await personal.remove();
  }
  if (economic) {
    await economic.remove();
  }
  await user.remove();

  res.status(200).json({
    success: true,
  });
});

exports.getCSS = () => `
@keyframes bounce {
    0%, 100% {
        transform: translateY(-5px);
    }
    50% {
        transform: translateY(5px);
    }
}
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(to right, #a8e6cf, #dcedc1);
    transition: background-color 5s;
    height:700px;
}
.card {
    padding: 20px;
    width: 400px;
    min-height: 700px;
    border-radius: 20px;
    background: #e8e8e8;
    box-shadow: 5px 5px 6px #dadada,
                -5px -5px 6px #f6f6f6;
    transition: 0.4s;
    margin-left:10%
}
img {
        width: 200px;
        height: auto;
        margin-top: 40px;
        margin-left:80px;  
        
    }
.card:hover {
translate: 0 -10px;
}

.card-title {
font-size: 18px;
font-weight: 600;
color: #2e54a7;
margin: 15px 0 0 10px;
}
.reason{
    color:red;
}

.card-image {
min-height: 170px;
background-color: #cfcfcf;
border-radius: 15px;
box-shadow: inset 8px 8px 10px #c3c3c3,
            inset -8px -8px 10px #cfcfcf;
}

.card-body {
margin: 13px 0 0 10px;
color: rgb(31, 31, 31);
font-size: 14.5px;
}

.footer {
float: right;
margin: 28px 0 0 18px;
font-size: 13px;
color: #636363;
}

.by-name {
font-weight: 700;
}

@keyframes bounce {
        0%, 100% {
            transform: translateY(-5px);
        }
        50% {
            transform: translateY(5px);
        }
    }

ul {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
a {
    color: #337ab7;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
}
a:hover {
    color: #ff8b94;
}
h2 {
    font-family: 'Roboto', sans-serif;
    font-size: 24px;
}
li {
    display: flex;
    align-items: center;
    transition: transform 0.3s;
    grid-column: span 2;
}
i {
    margin-right: 10px;
}
li:hover {
    transform: scale(1.1);
}
@media (max-width: 768px) {
body:hover {
    background-color: #dcedc1;
}
.card {
    padding: 20px;
    width: 350px;
    min-height: 800px;
    margin-left:0%
  }
img {
    width: 200px;
    height: auto;
    margin-top: 40px;
    margin-left:30px;  
    
}
}
`;

// Forgot Password
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.phoneNo)
    return next(new ErrorHandler("Phone is required", 400));
  const login = await Login.findOne({ phoneNo: req.body.phoneNo });
  if (!login) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  const resetToken = await login.getResetPasswordToken();
  await login.save({ validateBeforeSave: false });
  const user = await User.findById(login.id);
  const company = await Company.findById(login.id);
  const bank = await Bank.findById(login.id);
  const agent = await Agent.findById(login.id);
  const branch = await Branch.findById(login.id);
  const USER = "user";
  const COMPANY = "company";
  const BANK = "bank";
  const AGENT = "agent";
  const BRANCH = "branch";

  const role = login.role;
  let email = "";
  switch (role) {
    case USER:
      email = user.email;
      break;
    case COMPANY:
      email = company.cemail;
      break;
    case BANK:
      email = bank.bank_email;
      break;
    case AGENT:
      email = agent.email;
      break;
    case BRANCH:
      email = branch.branch_email;
      break;
  }
  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const resetPasswordUrl = `https://e-bidir.com/password/reset/${resetToken}`;
  // const message = `Your password reset token is : \n\n ${resetPasswordUrl}`;

  try {
    sendEmail({
      to: email,
      subject: "Password recovery",
      body: `<html>
    <head>
        <style>${this.getCSS()}</style> 
        <link rel="stylesheet" href="https://www.bootstrapcdn.com/fontawesome/6.4.0/css/all.min.css"> 
    </head>
    <body>
    <div class="card">
        <div class="card-image">
        <img src="https://res.cloudinary.com/da8hdfiix/image/upload/v1690793326/profile/djyiwphuexckf0gkryxh.png" alt="Ebidir Logo" loading="lazy">
        </div>
        <p class="card-title">Hi,</p>   
        <p class="card-title">Account Recovery</p>    
        <p class="card-body">Your Ebidir™ account recovery Link is sent below.</p>
        <p class="card-body" >
        <span class="reason" style='text-color:red'>
        Please Don't Share this link with anyone.Even if they say they are from E-bidir 
        </span>
        </p>
        <p class="card-body" >
        ${
          "Click on the link to recover your ebidir account<br/><a href='" +
          resetPasswordUrl +
          "'>recover your account</a>"
        }
        </p>
        <p class="footer">Call us on: <span class="by-name">+251 925 882-8232</span></p>
        <p class="footer">Email us on: <span class="by-name"><a href='mailto:support@e-bidir.com'>support@e-bidir.com</a></span></p>
        <p class="footer">Thank you for choosing Ebidir™.</p>
    </div>
    </body>
</html>`,

      cc: "abmo475@gmail.com,support@e-bidir.com",
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    login.resetPasswordToken = undefined;
    login.resetPasswordExpire = undefined;
    await login.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  try {
    const login = await Login.findById(req.user._id).select("+password");
    if (!login) return next(new ErrorHandler("User not found", 400));
    if (!req.body.oldPassword) {
      return next(new ErrorHandler("Old Password is Invalid", 400));
    }
    const isPasswordMatched = await login.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old Password is Invalid", 400));
    }
    if(req.body.oldPassword==req.body.newPassword)
    return next(new ErrorHandler("New password cant be same as old password", 400));
    const user = await User.findById(req.user.id);
    const company = await Company.findById(req.user.id);
    const bank = await Bank.findById(req.user.id);
    const agent = await AgentsModel.findById(req.user.id);
    const USER = "user";
    const COMPANY = "company";
    const BANK = "bank";
    const AGENT = "agent";
    const role = login.role;
    switch (role) {
      case USER:
        user.status = "active";
        await user.save();
        break;
      case COMPANY:
        company.status = "active";
        await company.save();
        break;
      case BANK:
        bank.status = "active";
        await bank.save();
        break;
      case AGENT:
        agent.status = "active";
        await agent.save();
    }

    login.password = req.body.newPassword;
    login.status = "active";
    await login.save();
    sendToken(login, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // create hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  const user = await Login.findOne({ resetPasswordToken });
  if (!user) {
    return next(new ErrorHandler("Invalid reset password token", 404));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});
exports.AllAccessBanks = asyncErrorHandler(async (req, res) => {
  const banks = await Bank.find();
  const bankdata = [];
  banks.forEach((bank) => {
    bankdata.push({
      bank_name: bank.bank_name,
      bank_email: bank.bank_email,
      bank_phoneNo: bank.bank_phoneNo,
    });
  });
  res.status(200).json({
    banks: bankdata,
  });
});
exports.GetMyAccountsPersonal = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find({ createdBy: req.user.id });
  res.status(200).json({
    users,
    success: true,
  });
});
exports.GetMyAccountsCompany = asyncErrorHandler(async (req, res, next) => {
  const companies = await Company.find({ createdBy: req.user.id });
  res.status(200).json({
    companies,
    success: true,
  });
});
exports.getAgent = asyncErrorHandler(async (req, res) => {
  const user = await AgentsModel.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
exports.UpdateBatch = asyncErrorHandler(async (req, res) => {
  const user = await Company.find();
});
exports.agentDetail=asyncErrorHandler(async(req,res,next)=>{
const {id}=req.params;
const users=await User.find({createdBy:id});
const companies=await Company.find({createdBy:id})
res.status(200).json({
  success:true,
  users,
  companies
})
})
