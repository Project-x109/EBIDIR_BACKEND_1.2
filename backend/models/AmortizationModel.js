const mongoose = require("mongoose");
const AmortizationSchema = new mongoose.Schema({
  amortize: [
    {
      month: {
        type: Date,
      },
      paid: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
