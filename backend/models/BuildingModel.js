const mongoose = require("mongoose");
const BuildingSchema = new mongoose.Schema({
  Location: {
    type: String,
    required: [true, "Please Enter Your Transmission"],
  },
  Year_of_Construction: {
    type: Number,
    required: [true, "Please Enter Your Year of Construction "],
  },
  Total_Area: {
    type: Number,
    required: [true, "Please Enter Your Total Area"],
  },
  Distance_from_Main_Road: {
    type: Number,
    required: [true, "Please Enter Your Distance from main Road"],
  },
  Type_of_Building: {
    type: String,
    required: [true, "Please Enter Your Type of Building"],
  },
  Purpose_of_the_Building: {
    type: String,
    required: [true, "Please Enter Your Purpose of the Building"],
  },
  Collateral_Coverage_Ratio: {
    type: Number,
  },
  Building_Score: {
    type: Number,
  },
  collateralValue:{
    type:Number,
    default:0
},
  blueprintId: {
    type: Number,
    required: [true, "Please Enter Your BluePrint Id"],
    unique: true,
  },
  blueprint: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  Construction_Status: {
    Sub_Structure: {
      type: Number,
      default: 0,
    },
    Super_Structure: {
      type: Number,
      default: 0,
    },
    Partially: {
      type: Number,
      default: 0,
    },
    Fully: {
      type: Number,
      default: 0,
    },
    Electro_Mechanical_Lifts: {
      type: Number,
      default: 0,
    },
  },
  utility: {
    water: {
      type: Number,
    },
    internet: {
      type: Number,
    },
    gas: {
      type: Number,
    },
    electricity: {
      type: Number,
    },
  },
  LoanId: {
    type: mongoose.Schema.ObjectId,
    ref: "Loan",
    required: true,
  },
  id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Building", BuildingSchema);
