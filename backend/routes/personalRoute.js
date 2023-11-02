const express = require("express");
const {getPersonalDetails,getAllPersonals,updatePersonal,AddPersonal,} = require("../controllers/personalController");
const {forgotPassword} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/register/personal").post(isAuthenticatedUser,authorizeRoles("user"),AddPersonal);
router.route("/me/personal").get(isAuthenticatedUser,authorizeRoles("user"), getPersonalDetails)
.put(isAuthenticatedUser,authorizeRoles("user"),updatePersonal);
router.route("/admin/personals").get(isAuthenticatedUser,authorizeRoles("admin"),getAllPersonals);
router.route("/password/forgot").post(forgotPassword);

module.exports = router;
