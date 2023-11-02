const express = require("express");
const {
  addLoan,
  getAllLoan,
  getLastEntry,
  addBLoan,
  getloan,
  getLoanByBankName,
  getLoanDetail,
  getbloan,
  getBLoanDetail,
  updateLoan,
  updateBLoan,
  getBLoanByBankName,
  getAllBLoan,
  updateAmortizationBLoan,
  updateAmortizationLoan,
  getBLoanByBranchName,
  getLoanByBranch,
} = require("../controllers/LoanControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();
router.route("/loan/add").post(isAuthenticatedUser,authorizeRoles("user"),addLoan);
router.route("/bloan/add").post(isAuthenticatedUser,authorizeRoles("company"), addBLoan);
router.route("/mybloan").get(isAuthenticatedUser,authorizeRoles("company"), getbloan);
router.route("/myloan").get(isAuthenticatedUser,authorizeRoles("user"), getloan);
router.route("/theloan").post(isAuthenticatedUser,authorizeRoles("admin","bank","branch","user"),getLoanDetail);
router.route("/thebloan").post(isAuthenticatedUser,authorizeRoles("admin","bank","branch","company"), getBLoanDetail);
router.route("/loan/update").post(isAuthenticatedUser,authorizeRoles("admin","bank","branch","user"),updateLoan);
router.route("/bloan/update").post(isAuthenticatedUser, authorizeRoles("admin","bank","branch"),updateBLoan);
router.route("/loanbybank").get(isAuthenticatedUser,authorizeRoles("bank","branch"), getLoanByBankName);
router.route("/bloanbybank").get(isAuthenticatedUser,authorizeRoles("bank","branch"), getBLoanByBankName);
router.route("/loanbybranch").get(isAuthenticatedUser,authorizeRoles("branch"), getLoanByBranch);
router.route("/bloanbybranch").get(isAuthenticatedUser,authorizeRoles("branch"), getBLoanByBranchName);
router.route("/admin/loans").get(isAuthenticatedUser,authorizeRoles("admin"), getAllLoan);
router.route("/bloans").get(isAuthenticatedUser,authorizeRoles("admin"), getAllBLoan);
router.route("/loan/amortize").post(isAuthenticatedUser, authorizeRoles("bank","branch"),updateAmortizationLoan);
router.route("/bloan/amortize").post(isAuthenticatedUser,authorizeRoles("bank","branch"),updateAmortizationBLoan);
router.route("/lastloan").get(isAuthenticatedUser,authorizeRoles("bank","admin"),getLastEntry);
module.exports = router;
