const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ActivityLog = require("../models/ActivityLog");
const ApplicationSetting = require("../models/ApplicationSetting");
const SystemSetting = require("../models/ApplicationSetting");
exports.Logger=async(data)=>{
    const log=await ActivityLog.create(data);
}
exports.ApplicationStatus=asyncErrorHandler(async(req,res)=>{
    const data={
        id:req.user.id,
        status:req.body.status,
        next:req.body.next
    }
    const sys=await SystemSetting.create({applicationStatus:data});
    res.status(200).json({
        status:sys.applicationStatus,
        success:true
    })
})
exports.getApplicationStatus=asyncErrorHandler(async(req,res)=>{
    const status = await ApplicationSetting.findOne({ id: req.user.id }).sort({
        field: "asc",
        _id: -1,
      });
res.status(200).json({
    status:status
})
})