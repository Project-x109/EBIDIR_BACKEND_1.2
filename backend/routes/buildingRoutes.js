const express = require("express");
const {
  addBuilding,
  getAllBuildings,
  getBuilding,
  BuildingById,
  BuildingByLoanId,
} = require("../controllers/BuildingControllers");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();
router.route("/building/add").post(isAuthenticatedUser, addBuilding);
router.route("/mybuilding").get(isAuthenticatedUser, getBuilding);
router.route("/building").post(isAuthenticatedUser, BuildingById);
router.route("/loanbuilding").post(isAuthenticatedUser, BuildingByLoanId);
router.route("/buildings").get(isAuthenticatedUser, getAllBuildings);

module.exports = router;
