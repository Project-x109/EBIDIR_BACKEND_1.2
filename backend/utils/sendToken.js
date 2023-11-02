const ApplicationSetting = require("../models/ApplicationSetting");

const sendToken = async (login, statusCode, res) => {
  const token = login.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
const status=await ApplicationSetting.findOne({id:login.id})
if(!status){
  await ApplicationSetting.create({id:login.id,next:"",status:""})
}
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    login,
    token,
  });
};

module.exports = sendToken;
