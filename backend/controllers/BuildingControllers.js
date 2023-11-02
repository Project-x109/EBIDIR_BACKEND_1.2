const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const cloudinary = require("cloudinary");
const BLoanModel = require("../models/BLoanModel");
const Building = require("../models/BuildingModel");
const Loan = require("../models/LoanModel");
const {
  LandCollateral,
  StatusCollateral,
  Score,
} = require("../middlewares/Dataset");
const PersonalModel = require("../models/PersonalModel");
const EconomicModel = require("../models/EconomicModel");
const userModel = require("../models/userModel");
const CarModel = require("../models/CarModel");
const BussinessModel = require("../models/BussinessModel");
const BEconomicModel = require("../models/BEconomicModel");
const { Rank } = require("./userController");
const { BluePrintNumberExists } = require("../middlewares/validator");
const { LoanApplied } = require("./EmailControllers");
const ApplicationSetting = require("../models/ApplicationSetting");

const ErrorHandler = require("../utils/errorHandler");
const { EmptyValidation } = require("../utils/Validations");
// Add
exports.addBuilding = asyncErrorHandler(async (req, res,next) => {
  try{
  const id = req.user.id;
  const {
    Location,
    Year_of_Construction,
    Total_Area,
    Distance_from_Main_Road,
    Type_of_Building,
    Purpose_of_the_Building,
    Construction_Status,
    utility,
    type,
    blueprintId,
  } = req.body;
  EmptyValidation({utility,Location,Year_of_Construction,Total_Area,Distance_from_Main_Road,Construction_Status,Type_of_Building,Purpose_of_the_Building,blueprintId})
  var lastLoan;
  if (type == 1)
    lastLoan = await Loan.findOne({ id: id }).sort({ field: "asc", _id: -1 });
  else if (type == 2)
    lastLoan = await BLoanModel.findOne({ id: id }).sort({
      field: "asc",
      _id: -1,
    });
  let blueprint = [];
  if (typeof req.body.scannedFiles === "string") {
    blueprint.push(req.body.blueprint);
  } else if(req.body.blueprint!=undefined) {
    blueprint = req.body.blueprint;
  }
  const blueprintLink = [];
  for (let i = 0; i < blueprint.length; i++) {
    const result = await cloudinary.v2.uploader.upload(blueprint[i], {
      folder: "blueprint",
    });
    blueprintLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  var statusScore = StatusCollateral(
    Total_Area,
    Type_of_Building,
    Construction_Status
  );
  var LandScore = LandCollateral(Location, Distance_from_Main_Road);
  var Discounted_collateral=(statusScore + LandScore * Total_Area)*0.6;
  var Collateral_Coverage_Ratio =Discounted_collateral / lastLoan.loan_amount;
  var Building_Score = Score(Collateral_Coverage_Ratio);
  const buildings = await Building.find();
  const uniqueBP = BluePrintNumberExists(buildings, blueprintId);
  if (uniqueBP) {
    const building = await Building.create({
      Location,
      Year_of_Construction,
      Total_Area,
      Distance_from_Main_Road,
      Type_of_Building,
      Purpose_of_the_Building,
      Construction_Status,
      utility,
      Building_Score: Building_Score,
      Collateral_Coverage_Ratio: Collateral_Coverage_Ratio,
      id,
      collateralValue:Discounted_collateral,
      LoanId: lastLoan._id,
      blueprint: blueprintLink,
      blueprintId,
    });
    var score = 0;
    if (type == 1) {
      const personal = await PersonalModel.findOne({ id: id });
      const economic = await EconomicModel.findOne({ id: id });
      if (lastLoan.Types_of_Collateral == "Building") {
        score =
          personal.PersonalScore + economic.economicScore + Building_Score;
          lastLoan.totalCollateral.building=Discounted_collateral;
      } else if (lastLoan.Types_of_Collateral == "Car,Building") {
        const lastCar = await CarModel.findOne({ LoanId: lastLoan._id });
        score =
          personal.PersonalScore +
          economic.economicScore +
          (Building_Score + lastCar.carScore) / 2.0;
          lastLoan.totalCollateral.car=lastCar.collateralValue;
          lastLoan.totalCollateral.building=Discounted_collateral;
      }
      const user = await userModel.findById(id);
      user.score = score;
      user.rank = Rank(score);
      user.save();
      LoanApplied({email:user.email,name:user.name})
      await ApplicationSetting.updateOne({id:req.user.id},{status:"",next:""})  
      lastLoan.score = score;
      lastLoan.rank = Rank(score);
      lastLoan.save();
    }
    if (type == 2) {
      const beconomic = await BEconomicModel.findOne({ id: id });
      if (lastLoan.Types_of_Collateral == "Building") {
        score = Building_Score + beconomic.economicScore;
        lastLoan.totalCollateral.building=Discounted_collateral;
      } else if (lastLoan.Types_of_Collateral == "Car,Building") {
        const lastCar = await CarModel.findOne({ LoanId: lastLoan._id });
        score =
          beconomic.economicScore + (Building_Score + lastCar.carScore) / 2.0;
          lastLoan.totalCollateral.car=lastCar.collateralValue;
          lastLoan.totalCollateral.building=Discounted_collateral;
      }
      const company = await BussinessModel.findById(id);
      company.score = score;
      company.rank = Rank(score);
      company.save();
      LoanApplied({email:company.cemail,name:company.cname})
      await ApplicationSetting.updateOne({id:req.user.id},{status:"",next:""})  
      lastLoan.score = score;
      lastLoan.rank = Rank(score);
      lastLoan.save();
    }
    res.status(200).json({
      success: true,
      building,
    });
  } else {
    res.status(400).json({
      success: true,
      message: "Building with blueprint exists",
    });
  }
}catch(err){
  return next(new ErrorHandler(err,400))
}
});
exports.getBuilding = asyncErrorHandler(async (req, res, next) => {
  const myBuilding = await Building.find({ id: req.user.id });
  res.status(200).json({
    success: true,
    myBuilding,
  });
});
// Building By Id
exports.BuildingById = asyncErrorHandler(async (req, res, next) => {
  const building = await Building.findById(req.body.id);
  res.status(200).json({
    success: true,
    building,
  });
});
// building by loan id
exports.BuildingByLoanId = asyncErrorHandler(async (req, res, next) => {
  const building = await Building.findOne({ LoanId: req.body.id });
  res.status(200).json({
    success: true,
    building,
  });
});
// All Building
exports.getAllBuildings = asyncErrorHandler(async (req, res, next) => {
  const buildings = await Building.find();
  res.status(200).json({
    success: true,
    buildings,
  });
});
