const express = require("express");
const {
  addEconomicDetails,
  getAllEconomic,
  addBEconomicDetails,
  getEconomicDetails,
  updateEconomic,
  getBEconomicDetails,
  updateBEconomic,
} = require("../controllers/EconomicControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/register/economic").post(isAuthenticatedUser,authorizeRoles("admin","user"),addEconomicDetails);
router.route("/register/beconomic").post(isAuthenticatedUser,authorizeRoles("admin","company"), addBEconomicDetails);
router.route("/me/economic")
  .get(isAuthenticatedUser, authorizeRoles("user"),getEconomicDetails)
  .put(isAuthenticatedUser,authorizeRoles("user"), updateEconomic);
router
  .route("/me/beconomic")
  .get(isAuthenticatedUser,authorizeRoles("company"),getBEconomicDetails)
  .put(isAuthenticatedUser,authorizeRoles("company"),updateBEconomic);
router.route("/admin/economics").get(isAuthenticatedUser,authorizeRoles("admin"),getAllEconomic);

module.exports = router;
