const { default: isEmail } = require('validator/lib/isEmail');
const BankModel = require('../models/BankModel');
exports.EmptyValidation=(data)=>{
    for(k in data){
        if(data[k]==""||data[k]==undefined){
            if(k=="cname")
            k="company name"
            if(k=="cemail")k="company email"
            if(k=="cphoneNo")k="company phone number"
            if(k=="CTIN_Number")k="Compny TIN Number"
        throw new Error(k.replace("_"," ").replace("_"," ")+" is required");
        }
    }
    return true;
}
exports.checkEmail=(email)=>{
if(!isEmail(email))
throw new Error("Email is not valid");
return true;
}
exports.isPhone=(phone)=>{
    const validPhoneRegex = RegExp(
        /(\+\s*2\s*5\s*1\s*9\s*(([0-9]\s*){8}\s*))|(\+\s*2\s*5\s*1\s*9\s*(([0-9]\s*){8}\s*))|(0\s*9\s*(([0-9]\s*){8}))|(0\s*7\s*(([0-9]\s*){8}))/
      );
      if(!validPhoneRegex.test(phone))
      throw new Error("Phone number is Invalid")
    return true;
}
exports.isGender=(gender)=>{
    if(!gender)
    return false;
    if(gender!="male"&&gender!='female'&&gender!="Male"&&gender!='Female')
    return false;
    return true;
}
exports.isNumber=(value)=>{
    for(k in value){
        if (typeof value[k] === "string") {
            if(isNaN(value[k]))
            throw new Error(k+ " must be number")
        }
    }
    return true
}
exports.isJobStatus=(status)=>{
     if(!["Employed", "Self Employed", "UnEmployed"].includes(status)){
        throw new Error("Job status is not valid")
     }
     return true;
}
exports.isPositive=(data)=>{
   for(k in data){
    if(data[k]<0)
    throw new Error(k.replace('_',' ')+" must be positive");
   }
   return true;
}
exports.isCollateral=(type)=>{
    if(!["Car", "Building", "Car,Building"].includes(type)){
       throw new Error(" Collateral type not suppoted")
    }
    return true;
}
exports.isBank=async (bankName)=>{
   const bank=await BankModel.findOne({bank_name:bankName})
   if(!bank)
   throw new Error(bankName+" is not registered in Ebidir Platform as Bank name")
   return true;
}
exports.isLoanType=(types,type)=>{
    const collectedTypes=[];
    types.map(value=>{
collectedTypes.push(value.type)
    })
    if(!collectedTypes.includes(type))
    throw new Error(type+" is not supported type for selected bank")
    return true;
}