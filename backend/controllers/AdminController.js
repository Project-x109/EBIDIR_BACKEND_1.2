const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const AdminPanelMode = require("../models/AdminPanelMode");
const mailer = require('nodemailer');
const BankModel = require("../models/BankModel");
exports.addBanks=asyncErrorHandler(async(req,res,next)=>{
    const banks=await AdminPanelMode.find();
    let bank_added;
    if(!banks.length){
         bank_added=await AdminPanelMode.create(req.body)
    }else{
        const newbank=await AdminPanelMode.findById(banks[0]._id);
        let bankList=newbank.banks;
        Array.isArray(req.body.banks)&&req.body.banks.forEach(element => {
            if(!bankList.includes(element))
            bankList.push(element);
        });
       req.body.banks=bankList;
         bank_added=await AdminPanelMode.findByIdAndUpdate(banks[0]._id,req.body);
    }
    res.status(200).json({
        status:true,
        bank_added
    })
})
exports.getBanks=asyncErrorHandler(async(req,res,next)=>{
let banks=await AdminPanelMode.find();
if(banks.length==1){
banks=banks[0].banks;
}
const bankArray=[];
const bankData=await BankModel.find();
console.log(bankData)
const bankData2=[];
bankData.forEach(item=>{
    bankData2.push(item.bank_name);
})
banks.forEach(element=>{
    if(!bankData2.includes(element))
    bankArray.push(element)
})
// console.log(bankArray)
res.status(200).json({
    success:true,
    bank_names:bankArray})
})
