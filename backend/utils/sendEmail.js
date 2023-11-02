const mailer = require('nodemailer');
const sendEmail = async (data) => {
  const transporter=mailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.FROM,
        pass:process.env.PASS
    },
    tls:{
        rejectUnauthorized:false,
    }
})
const mailoption={
to:data.to,
from:process.env.FROM,
subject:data.subject,
html:data.body,
cc:data.cc
}
let response;
transporter.sendMail(mailoption,(err,success)=>{
if(err){
    response= err;
}else{
    response= 'message sent'
}
})
return response;
};
module.exports = sendEmail;
