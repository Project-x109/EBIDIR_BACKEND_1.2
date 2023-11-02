const mongoose =require('mongoose');
const ActivityLog=new mongoose.Schema({
user:{
        type:String,
        required: true
    },
operation:{
    type:String,
    required:true
},
link:{
    type:String,
    default:""
},
createdAt:{
    type:Date,
    default:Date.now
}
})
module.exports= mongoose.model("Log",ActivityLog);