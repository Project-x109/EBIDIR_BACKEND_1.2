const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(cors());
// config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const user = require("./routes/userRoute");
const personal = require("./routes/personalRoute");
const economic = require("./routes/economicRoute");
const building = require("./routes/buildingRoutes");
const loan = require("./routes/LoanRoute");
const car = require("./routes/carRoutes");
const admin=require('./routes/AminPanelRoutes')
const system=require("./routes/systemRoute");
const ErrorHandler = require("./utils/errorHandler");

/* app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  if (userAgent && userAgent.includes("PostmanRuntime")) {
    return next(new ErrorHandler("Request from Postman is not supported"));
  }
  // Allow access for requests coming from web browsers
  next();
}); 

 app.use((req, res, next) => {

  const userAgent = req.headers['user-agent'];

  if (!userAgent) {
    return next(new ErrorHandler("Requests without user-agent are not allowed"));
  }

  if (!userAgent.includes("Chrome") 
    && !userAgent.includes("Firefox")
    && !userAgent.includes("Safari")
    && !userAgent.includes("Edge")
    && !userAgent.includes("OPR")
    && !userAgent.includes("Focus")
    && !userAgent.includes("Klar")
    && !userAgent.includes("YaBrowser")
    && !userAgent.includes("Epic")
    && !userAgent.includes("e_bidir")
    && !userAgent.includes("e_bidir")
  ) {
    return next(new ErrorHandler("Only requests from browsers are allowed")); 
  }

  next();

}) */; 

// app.use((req,res,next)=>{
//   if(req.headers['user-agent'].startsWith("Post"))
//   return next(new ErrorHandler("Request from post man is not supported"));
// })

app.use("/api/v1", user);
app.use("/api/v1", personal);
app.use("/api/v1", economic);
app.use("/api/v1", car);
app.use("/api/v1", building);
app.use("/api/v1", loan);
app.use("/api/v1",system);
app.use("/api/v1",admin);

app.use(cors());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
const maxSize = 10 * 1000 * 1000;

exports.upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    var filetypes = /jpeg|jpg|png|pdf/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
        "following filetypes - " +
        filetypes
    );
  },

  // mypic is the name of file attribute
}).array("files", 6);

app.post("/uploadProfilePicture", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.send(err);
    } else {
      // SUCCESS, image successfully uploaded
      res.send("Success, Image uploaded!");
    }
  });
});

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

// error middleware

app.use(errorMiddleware);

module.exports = app;
