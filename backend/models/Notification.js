const mongoose=require('mongoose')
const NotificationSchema=new mongoose.Schema({
title:{
    type:String,
    required:true
},
status:{
    default:"new"
},
createdAt:{
    default:Date.now
}




})
module.exports=mongoose.model("Notification",NotificationSchema);