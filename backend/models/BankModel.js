const mongoose = require("mongoose");
const BankSchema = new mongoose.Schema({
  bank_name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  bank_email: {
    type: String,
    required: [true, "Please Enter Your Email"], 
    unique: true,
  },
  bank_phoneNo: {
    type: String,
    required: [true, "Please Enter phone"],
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
  logo: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: "bank",
  },
  status: {
    type: String,
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bank", BankSchema);
