const express = require("express");

const {
  loginUser,
  logoutUser,
  getUserDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  getAllBanks,
  getBank,
  getUser,
  getAllCompanies,
  getCompany,
  updateCompany,
  updateProfileBank,
  updateProfileBusy,
  deleteAccount,
  AddUsers,
  AddCompany,
  AddBank,
  Activate,
  AddBranch,
  getBranch,
  getBranchByBank,
  getAllBranches,
  getMyBranches,
  getLoanType,
  AdminDeleteAccount,
  getBankByBranch,
  AddAgent,
  GetMyAccountsPersonal,
  GetMyAccountsCompany,
  getAgent,
  getAllAgents,
  UpdateBatch,
  getUserById,
  getCompanyById,
  agentDetail,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth"); 
const router = express.Router();
router.route("/register/user").post(isAuthenticatedUser,authorizeRoles("admin","agent"),AddUsers);
router.route("/register/agent").post(isAuthenticatedUser,authorizeRoles("admin"), AddAgent);
router.route("/register/company").post(isAuthenticatedUser, authorizeRoles("admin","agent"),AddCompany); 
router.route("/register/bank").post(isAuthenticatedUser, authorizeRoles("admin"), AddBank);
router.route('/addbranch').post(isAuthenticatedUser, authorizeRoles("admin","bank"),AddBranch);
router.route("/login").post(loginUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails); 
router.route("/user").get(isAuthenticatedUser,authorizeRoles("user","admin"), getUser);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("bank","branch","admin"), getUserById);
router.route("/admin/company/:id").get(isAuthenticatedUser,authorizeRoles("bank","branch","admin"), getCompanyById);
router.route("/agent").get(isAuthenticatedUser,authorizeRoles("agent"), getAgent);
router.route("/company").get(isAuthenticatedUser,authorizeRoles("company","admin"), getCompany);
router.route("/logout").get(isAuthenticatedUser,logoutUser);
router.route("/mybank").get(isAuthenticatedUser,authorizeRoles("bank"), getBank);
router.route("/branch/mybank").get(isAuthenticatedUser,authorizeRoles("branch"),getBankByBranch)
router.route("/mybranch").get(isAuthenticatedUser,authorizeRoles("branch"), getBranch);
router.route("/admin/users").get( isAuthenticatedUser,authorizeRoles("admin","bank","branch"),getAllUsers);
router.route("/admin/banks").get(isAuthenticatedUser,authorizeRoles("admin","user","bank","branch","agent","company") ,getAllBanks);
router.route("/admin/agents").get(isAuthenticatedUser,authorizeRoles("admin","agent"),getAllAgents)
router.route("/admin/companies").get(isAuthenticatedUser,authorizeRoles("admin","bank","branch"), getAllCompanies);
router.route("/delete").post(isAuthenticatedUser,deleteAccount);
router.route("/admin/delete").post(isAuthenticatedUser,authorizeRoles("admin"),AdminDeleteAccount);
router.route("/activate").post(isAuthenticatedUser, authorizeRoles("admin"),Activate);
router.route("/changepass").put(isAuthenticatedUser, updatePassword);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset").post(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/busy/update").put(isAuthenticatedUser,authorizeRoles("company"),updateProfileBusy);
router.route("/me/update").put(isAuthenticatedUser,authorizeRoles("user"),updateProfile);
router.route("/bank/update").put(isAuthenticatedUser,authorizeRoles("bank"),updateProfileBank);
router.route("/admin/user/:id")
  .get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"),updateUserRole)
  .delete(isAuthenticatedUser,authorizeRoles("admin"), deleteUser);
router.route("/admin/company/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateCompany);
router.route("/bankbranches").post(isAuthenticatedUser,authorizeRoles("admin","user","company"),getBranchByBank); // get branchs by bank name in admin
router.route("/branches").get(isAuthenticatedUser,authorizeRoles("admin"),getAllBranches);
router.route("/mybranches").get(isAuthenticatedUser,authorizeRoles("bank"),getMyBranches);
// router.route("/verify").get(isAuthenticatedUser ,verifyAccount)
router.route("/loantypes").post(isAuthenticatedUser,getLoanType);
router.route("/agent/users").get(isAuthenticatedUser,authorizeRoles("agent"),GetMyAccountsPersonal)
router.route("/agent/companies").get(isAuthenticatedUser,authorizeRoles("agent"),GetMyAccountsCompany)
router.route("/agent/detail/:id").get(isAuthenticatedUser,authorizeRoles("admin"),agentDetail)
module.exports = router;


 
