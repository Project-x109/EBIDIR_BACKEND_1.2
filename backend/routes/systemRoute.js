const express=require("express");
const { getApplicationStatus } = require("../controllers/SystemController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router=express.Router();
// router.route("/app/status").post(isAuthenticatedUser,ApplicationStatus);
router.route("/getstatus").get(isAuthenticatedUser,getApplicationStatus);
module.exports = router;