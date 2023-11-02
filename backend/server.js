const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const ErrorHandler = require("./utils/errorHandler");

// UncaughtException Error
process.on("uncaughtException", (err) => {
  process.exit(1);
});
  connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const server = app.listen(PORT, () => {
  console.log("server is Running")
})
// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  // server.close(() => {
  //   process.send(err)
  // });
});
app.use(function(req,res){
  res.status(404).json({message:"The link you privided is broken"});
});
const corsOptions = {
  origin: "https://e-bidir.com/",
  credentials: true, //
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));