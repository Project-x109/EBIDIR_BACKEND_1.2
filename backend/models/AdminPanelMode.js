const mongoose=require('mongoose');
const AdminPanelSchema=mongoose.Schema({
banks:[
    {
    type:String
    }
],
loan_limit:{
    type:Number,
    default:3
},
loan_types:[
    {
      type:{
        type:String,
        required:true
      },
      rate:{
        type:Number,
        required:true
      }
    }
  ],
})
module.exports=mongoose.model("adminPanel",AdminPanelSchema);