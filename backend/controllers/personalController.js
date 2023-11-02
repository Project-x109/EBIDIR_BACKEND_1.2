const Personal = require("../models/PersonalModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const { getPersonalScore } = require("../middlewares/Dataset");
const { Logger } = require("./SystemController");
const { EmptyValidation, isNumber } = require("../utils/Validations");
const ErrorHandler = require("../utils/errorHandler");
// Add personal info

exports.AddPersonal = asyncErrorHandler(async (req, res,next) => {
  try{
  const id = req.user.id;
  const {
    age,Education_Status,Marriage_Status,Number_Of_Dependents,Criminal_Record,
  } = req.body;
  EmptyValidation({age,Education_Status,Marriage_Status,Number_Of_Dependents,Criminal_Record})
  isNumber({age,Number_Of_Dependents})
  if(age<18)
  return next(new ErrorHandler("Age must be greater than 18"))
  if(age>100)
  return next(new ErrorHandler("Age is not valid"))
  if(!["Below Highschool","Highschool","Diploma","Degree","Masters","Phd"].includes(Education_Status))
  return next(new ErrorHandler("Educational Status is not valid"))
  if(!["No","YES/PAST FIVE YEARS","YES/MORE THAN FIVE YEARS"].includes(Criminal_Record))
  return next(new ErrorHandler("Criminal Record is not valid"))
  if(!["Married","single","divorced","widowed"].includes(Marriage_Status))
  return next(new ErrorHandler("Marriage Status is not valid"))
  var PersonalScore = getPersonalScore(
    age,
    Education_Status,
    Marriage_Status,
    Number_Of_Dependents,
    Criminal_Record
  );
  const personal = await Personal.create({
    age: age,
    Education_Status: Education_Status,
    Marriage_Status: Marriage_Status,
    Number_Of_Dependents: Number_Of_Dependents,
    Criminal_Record: Criminal_Record,
    PersonalScore: PersonalScore,
    id: id,
  });
  res.status(200).json({
    success: true,
    personal,
  });
}catch(err){
  return next(new ErrorHandler(err,400))
}
});
// update personal
exports.updatePersonal = asyncErrorHandler(async (req, res,next) => {
  try{
  const {
    age,
    Education_Status,
    Marriage_Status,
    Number_Of_Dependents,
    Criminal_Record,
  } = req.body;
  EmptyValidation({age,Education_Status,Marriage_Status,Number_Of_Dependents,Criminal_Record})
  isNumber({age,Number_Of_Dependents})
  if(age<18)
  return next(new ErrorHandler("Age must be greater than 18"))
  if(age>100)
  return next(new ErrorHandler("Age is not valid"))
  if(!["Below Highschool","Highschool","Diploma","Degree","Masters","Phd"].includes(Education_Status))
  return next(new ErrorHandler("Educational Status is not valid"))
  if(!["No","YES/PAST FIVE YEARS","YES/MORE THAN FIVE YEARS"].includes(Criminal_Record))
  return next(new ErrorHandler("Criminal Record is not valid"))
  if(!["Married","single","divorced","widowed"].includes(Marriage_Status))
  return next(new ErrorHandler("Marriage Status is not valid"))
  var PersonalScore = getPersonalScore(
    age,
    Education_Status,
    Marriage_Status,
    Number_Of_Dependents,
    Criminal_Record
  );
  const newdata = {
    age: age,
    Education_Status: Education_Status,
    Marriage_Status: Marriage_Status,
    Number_Of_Dependents: Number_Of_Dependents,
    Criminal_Record: Criminal_Record,
    PersonalScore: PersonalScore,
  };
  const personal = await Personal.findOne({ id: req.user.id });
  Logger({user:req.user.id,operation:"Update personal info",link:("orginal:"+JSON.stringify(personal)+"New : "+JSON.stringify(newdata))});
 
  await Personal.findByIdAndUpdate(personal._id, newdata, {
    new: true,
    runValidators: true, 
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
  });
}catch(err){
  return next(new ErrorHandler(err,400))
}
});
// Get personal Details
exports.getPersonalDetails = asyncErrorHandler(async (req, res) => {
  const personal = await Personal.findOne({ id: req.user.id });
  res.status(200).json({
    success: true,
    personal,
  });
});
// Get All Users --ADMIN
exports.getAllPersonals = asyncErrorHandler(async (req, res) => {
  const personals = await Personal.find();
  res.status(200).json({
    success: true,
    personals,
  });
});
