// const mongoose = require('mongoose');
// const MONGO_URI = process.env.MONGO_URI;

// const connectDatabase = () => {
//     mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//         .then(() => {
//
//         });
// }
const mongoose = require("mongoose");
// Set up default mongoose connection
const connectDatabase = async(req,res) => {
  //const mongoDB = "mongodb://localhost:27017/bidir";
  //const mongoDB = "mongodb+srv://amanuelgirma109:gondar2022@cluster1.y0w8csy.mongodb.net/?retryWrites=true&w=majority";
  const mongoDB =
    "mongodb+srv://amanuelgirma109:gondar2022@ebidir.42rpbko.mongodb.net/?retryWrites=true&w=majority";
    mongoose.set("strictQuery", false);
  try{
  mongoose.connect(mongoDB, {useNewUrlParser: true,useUnifiedTopology: true});
  // Get the default connection
  const db = mongoose.connection;
  db.on("connected", () => {
    console.log("Database connected");});
  
  // Bind connection to error event (to get notification of connection errors)
}catch(err){
  // db.on("error", console.error.bind(console, "MongoDB connection error:"));

}
};
module.exports = connectDatabase;
