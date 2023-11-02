const express=require('express');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { addBanks, getBanks } = require('../controllers/AdminController');
const router=express.Router();

router.route("/adminpanel/addbanks").post(addBanks);
router.route("/adminpanel/getbanks").get(getBanks);
module.exports=router;