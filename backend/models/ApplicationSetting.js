const mongoose=require('mongoose');
const ApplicationSetting=new mongoose.Schema({
    id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
        unique:true,
      },
      status:{
        type:String,
      },
      next:{
        type:String,
      },
      createdAt:{
        type:Date,
        default:Date.now
      }
})
module.exports= mongoose.model('ApplicationSetting',ApplicationSetting);