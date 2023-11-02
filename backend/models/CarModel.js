const mongoose = require("mongoose");
const EconomicStatusSchema = new mongoose.Schema({
  Transmission: {
    type: String,
    required: [true, "Please Enter Your Transmission"],
  },
  Number_of_Cylinders: {
    type: Number,
    required: [true, "Please Enter Your Number of Cylinders "],
  },
  Country_of_Manufacture: {
    type: String,
    required: [true, "Please Enter Your Country of Manufacture"],
  },
  Year_of_Manufacture: {
    type: Number,
    required: [true, "Please Enter Your Year of Manufacture"],
  },
  Model_of_Vehicle: {
    type: String,
    required: [true, "Please Enter Your Model of Vehicle"],
  },
  Brand_of_Vehicle: {
    type: String,
    required: [true, "Please Enter Your Brand of Vehicle"],
  },
  Type_of_Vehicle: {
    type: String,
    required: [true, "Please Enter Your Type of Vehicle"],
  },
  Horsepower: {
    type: Number,
    required: [true, "Please Enter Your Type Horsepower"],
    min: [0, "Horsepower must be Positive"],
  },
  Transportation_Capacity: {
    type: Number,
    required: [true, "Please Enter Your Transportation Capacity"],
  },
  Mileage: {
    type: Number,
    min: [0, "Millage must be Positive"],
    required: [true, "Please Enter Your Milage"],
  },
  Plate_Number: {
    type: String,
    unique: true,
    required: [true, "Please Enter Your Plate Number"],
  },
  carScore: {
    type: Number,
    required: true,
  },
  collateralValue:{
      type:Number,
      default:0
  },
  Collateral_Coverage_Ratio: {
    type: Number,
    required: true,
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
  carImage: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Car", EconomicStatusSchema);
