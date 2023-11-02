const express = require("express");
const {
  addCar,
  GetCar,
  getAllCars,
  carById,
  GetCarByLoanId,
} = require("../controllers/CarControllers");
const { getAllLoan, getLastEntry } = require("../controllers/LoanControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/car/add").post(isAuthenticatedUser, addCar);
router.route("/mycars").get(isAuthenticatedUser, GetCar);
router.route("/car").post(isAuthenticatedUser, carById);
router.route("/loancar").post(isAuthenticatedUser, GetCarByLoanId);
router.route("/cars").get(isAuthenticatedUser, getAllCars);

module.exports = router;
