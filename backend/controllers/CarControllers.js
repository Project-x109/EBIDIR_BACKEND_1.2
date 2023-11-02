const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const { CAR_COLLATERAL_VALUE, Score } = require("../middlewares/Dataset");
const BLoanModel = require("../models/BLoanModel");
const Car = require("../models/CarModel");
const Loan = require("../models/LoanModel");
const cloudinary = require("cloudinary");
const PersonalModel = require("../models/PersonalModel");
const EconomicModel = require("../models/EconomicModel");
const userModel = require("../models/userModel");
const BEconomicModel = require("../models/BEconomicModel");
const BussinessModel = require("../models/BussinessModel");
const { Rank } = require("./userController");
const { PlateNumberExists } = require("../middlewares/validator");
const { LoanApplied, AccountDeactivated } = require("./EmailControllers");
const ApplicationSetting = require("../models/ApplicationSetting");
const LoginModel = require("../models/LoginModel");
// Add
exports.addCar = asyncErrorHandler(async (req, res) => {
  const id = req.user.id;
  const login=await LoginModel.findOne({id:id});
  var date = new Date().toISOString().substring(2, 10);
  let carImage = [];
  if (typeof req.body.carImage === "string") {
    carImage.push(req.body.carImage);
  } else {
    carImage = req.body.carImage;
  }
  const carImageLink = [];
  for (let i = 0; i < carImage.length; i++) {
    const result = await cloudinary.v2.uploader.upload(carImage[i], {
      folder: "carImage",
    });
    carImageLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.carImage = carImageLink;
  const {
    Type_of_Vehicle,
    Brand_of_Vehicle,
    Model_of_Vehicle,
    Year_of_Manufacture,
    Country_of_Manufacture,
    Transmission,
    Number_of_Cylinders,
    Horsepower,
    Transportation_Capacity,
    Mileage,
    Plate_Number,
    type,
  } = req.body;
  var LoanId;
  var lastLoan;
  if (type === "1") {
    lastLoan = await Loan.findOne({ id: id }).sort({ field: "asc", _id: -1 });
    LoanId = lastLoan._id;
  } else if (type === "2") {
    lastLoan = await BLoanModel.findOne({ id: id }).sort({
      field: "asc",
      _id: -1,
    });
    LoanId = lastLoan._id;
  }
  var Discounted_Collateral_Value =CAR_COLLATERAL_VALUE(Model_of_Vehicle, Year_of_Manufacture, Mileage) *0.6 *1000;
  var Collateral_Coverage_Ratio =
    Discounted_Collateral_Value / lastLoan.loan_amount;  
  var carScore = Score(Collateral_Coverage_Ratio);
  const cars = await Car.find();
  const uniquePlate = PlateNumberExists(cars, Plate_Number);  
  if (uniquePlate) {
    const car = await Car.create({
      Type_of_Vehicle,
      Brand_of_Vehicle,
      Model_of_Vehicle,
      Year_of_Manufacture,
      Country_of_Manufacture,
      Transmission,
      Number_of_Cylinders,
      Horsepower,
      Transportation_Capacity,
      carScore: carScore,
      Mileage,
      Plate_Number,
      collateralValue:Discounted_Collateral_Value,
      Collateral_Coverage_Ratio: Collateral_Coverage_Ratio,
      id,
      LoanId: LoanId,
      carImage: carImageLink,
    });
    let myloan=[];
    let count=0;
    var score = 0;
    if (type == "1") {
      const personal = await PersonalModel.findOne({ id: id });
      const economic = await EconomicModel.findOne({ id: id });
      if (lastLoan.Types_of_Collateral == "Car") {
        score = personal.PersonalScore + economic.economicScore + carScore;
        const user = await userModel.findById(id);
        await ApplicationSetting.updateOne({id:req.user.id},{status:"",next:""})  
        user.score = score;
        user.rank = Rank(score);
        LoanApplied({email:user.email,name:user.name})
        myloan=await Loan.find({id:id});
        Array.isArray(myloan) &&
        myloan.map((item) => {
          var newDate = new Date(item.createdAt).toISOString().substring(2, 10);
          if (date === newDate)
          count++;
        });
        if(count>process.env.LIMIT){
          res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
          });
          user.status = "inactive";
          login.status = "inactive";
          user.save();
          login.save();
          AccountDeactivated({email:user.email,name:user.name,reason:"Loan application limit passed"})
        }
        lastLoan.score = score;
        lastLoan.rank = Rank(score);
        lastLoan.totalCollateral.car=Discounted_Collateral_Value;
        lastLoan.save();
      }else{
        await ApplicationSetting.updateOne({id:req.user.id},{status:lastLoan.Types_of_Collateral,next:"/Building/1"})  
      }
    } else if (type == "2") {
      const beconomic = await BEconomicModel.findOne({ id: id });
      if (
        lastLoan.Types_of_Collateral == "Car" ||
        lastLoan.Types_of_Collateral == "car"
      ) {
        score = beconomic.economicScore + carScore;
        const company = await BussinessModel.findById(id);
        company.score = score;
        company.rank = Rank(score);
        company.save();
        LoanApplied({email:company.cemail,name:company.cname})
          myloan=await BLoanModel.find({id:id});
          const user= await BussinessModel.findById(id)
          Array.isArray(myloan) &&
        myloan.map((item) => {
          var newDate = new Date(item.createdAt).toISOString().substring(2, 10);
          if (date === newDate)
          count++;
        });
        if(count>process.env.LIMIT){
          res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
          });
          user.status = "inactive";
          login.status = "inactive";
          user.save();
          login.save();
          AccountDeactivated({email:user.cemail,name:user.cname,reason:"Loan application limit passed"})
        }
        await ApplicationSetting.updateOne({id:req.user.id},{status:"",next:""})  
        lastLoan.score = score;
        lastLoan.rank = Rank(score);
        lastLoan.totalCollateral.car=Discounted_Collateral_Value;
        lastLoan.save();
      }else{
        await ApplicationSetting.updateOne({id:req.user.id},{status:lastLoan.Types_of_Collateral,next:"/Building/2"})  
      }
    }


    
    res.status(200).json({
      success: true,
      car,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Car with plate number exists",
    });
  }
});
//Get my car
exports.GetCar = asyncErrorHandler(async (req, res) => {
  const mycars = await Car.find({ id: req.user.id });
  res.status(200).json({
    success: true,
    mycars,
  });
});
//Get Car for Loan
exports.GetCarByLoanId = asyncErrorHandler(async (req, res) => {
  const car = await Car.findOne({ LoanId: req.body.id });
  res.status(200).json({
    success: true,
    car,
  });
});
// Get car By Car Id
exports.carById = asyncErrorHandler(async (req, res) => {
  const car = await Car.findById(req.body.id);
  res.status(200).json({
    success: true,
    car,
  });
});
// All cars In The System
exports.getAllCars = asyncErrorHandler(async (req, res) => {
  const cars = await Car.find();
  res.status(200).json({
    success: true,
    cars,
  });
});
