const BranchModel = require("../models/BranchModel");
const sendEmail = require("../utils/sendEmail");

exports.getCSS = () => `
@keyframes bounce {
    0%, 100% {
        transform: translateY(-5px);
    }
    50% {
        transform: translateY(5px);
    }
}
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(to right, #a8e6cf, #dcedc1);
    transition: background-color 5s;
    height:700px;
}
.card {
    padding: 20px;
    width: 400px;
    min-height: 700px;
    border-radius: 20px;
    background: #e8e8e8;
    box-shadow: 5px 5px 6px #dadada,
                -5px -5px 6px #f6f6f6;
    transition: 0.4s;
    margin-left:10%
}
img {
        width: 200px;
        height: auto;
        margin-top: 40px;
        margin-left:80px;  
        
    }
.card:hover {
translate: 0 -10px;
}

.card-title {
font-size: 18px;
font-weight: 600;
color: #2e54a7;
margin: 15px 0 0 10px;
}
.reason{
    color:red;
}

.card-image {
min-height: 170px;
background-color: #cfcfcf;
border-radius: 15px;
box-shadow: inset 8px 8px 10px #c3c3c3,
            inset -8px -8px 10px #cfcfcf;
}

.card-body {
margin: 13px 0 0 10px;
color: rgb(31, 31, 31);
font-size: 14.5px;
}

.footer {
float: right;
margin: 28px 0 0 18px;
font-size: 13px;
color: #636363;
}

.by-name {
font-weight: 700;
}

@keyframes bounce {
        0%, 100% {
            transform: translateY(-5px);
        }
        50% {
            transform: translateY(5px);
        }
    }

ul {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
a {
    color: #337ab7;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
}
a:hover {
    color: #ff8b94;
}
h2 {
    font-family: 'Roboto', sans-serif;
    font-size: 24px;
}
li {
    display: flex;
    align-items: center;
    transition: transform 0.3s;
    grid-column: span 2;
}
i {
    margin-right: 10px;
}
li:hover {
    transform: scale(1.1);
}
@media (max-width: 768px) {
body:hover {
    background-color: #dcedc1;
}
.card {
    padding: 20px;
    width: 350px;
    min-height: 800px;
    margin-left:0%
  }
img {
    width: 200px;
    height: auto;
    margin-top: 40px;
    margin-left:30px;  
    
}
}
`;
exports.verifyAccount = async (req, res) => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  const branch = await BranchModel.findById(req.user.id);
  const body =
    /*    "<div style='font-size:18px'>Dear Amanuel girma</b>!<hr> <br><br>Your verification code is " +
    OTP +
    ".<br><br><br>" +
    "Enter this code in our Website to activate your Ebidir account.<br><br>" +
    "Click  <a href='https://ebidir.com/verify/'" +
    OTP +
    OTP +
    ">here</a> to open the verification page <br/>" +
    "If you have any questions, send us an email support@e-bidir.com.</br><b></b></div><br><br>" +
    "<i style='font-size:16'>We’re glad you’re here!<br>" +
    "The Ebidir Team</i>"; */
    `  <html>
    <head>
        <style>${this.getCSS()}</style> 
        <link rel="stylesheet" href="https://www.bootstrapcdn.com/fontawesome/6.4.0/css/all.min.css">
    </head>
    <body>
    <div class="card">
        <div class="card-image">
        <img src="https://res.cloudinary.com/da8hdfiix/image/upload/v1690793326/profile/djyiwphuexckf0gkryxh.png" alt="Ebidir Logo" loading="lazy">
        </div>
        <p class="card-title">Hi ${data.name},</p>   
        <p class="card-body">We have received a request to log in to your Ebidir™ account.</p>
        <p class="card-body">To verify your identity, please enter the following OTP (one-time password) in the login page:</p>
        <p class="card-body"><strong> <a href='https://ebidir.com/verify/${OTP}${OTP}'>here</a></strong></p>
        <p class="card-body">This OTP is valid for 10 minutes and can only be used once.</p>
        <p class="card-body">If you did not request this OTP, please ignore this email and contact us immediately.</p>
        <p class="card-body">We're here for you if you need support:</p>        
        <p class="footer">Call us on: <span class="by-name">+251 925 882-8232</span></p>
        <p class="footer">Email us on: <span class="by-name"><a href='mailto:support@e-bidir.com'>support@e-bidir.com</a></span></p>
        <p class="footer">Thank you for choosing Ebidir™.</p>
    </div>
    </body>
</html>`;

  const label = await sendEmail({
    to: "amanuelgirma108@gmail.com",
    subject: "Verify Your Account",
    body: body,
    cc: process.env.FROM,
  });
  res.send({ label });
};

exports.AccountCreated = (data) => {
  let bod = `
    <html>
    <head>
        <style>${this.getCSS()}</style> 
        <link rel="stylesheet" href="https://www.bootstrapcdn.com/fontawesome/6.4.0/css/all.min.css">
    </head>
    <body>
    <div class="card">
        <div class="card-image">
        <img src="https://res.cloudinary.com/da8hdfiix/image/upload/v1690793326/profile/djyiwphuexckf0gkryxh.png" alt="Ebidir Logo" loading="lazy">
        </div>
        <p class="card-title">Hi ${data.name},</p>   
        <p class="card-body">Congratulations! Your Ebidir™ account has been created successfully.</p>
        <p class="card-body">Here's what you need to do next:</p>
        <ul class="card-body">
            <li><i class="fab fa-lock"></i> Set your password</li>
            <li><i class="fab fa-user-circle"></i> Log in to your account</li>
            <li><i class="fab fa-coins"></i> Apply for your first loan</li>
        </ul>
        <p class="card-body">Once your password is set, you can start using our platform and access our help center if you need any assistance.</p>
        <p class="card-body">We're here for you if you need support:</p>        
        <p class="footer">Call us on: <span class="by-name">+251 925 882-8232</span></p>
        <p class="footer">Email us on: <span class="by-name"><a href='mailto:support@e-bidir.com'>support@e-bidir.com</a></span></p>
        <p class="footer">Thank you for choosing Ebidir™.</p>
    </div>
    </body>
</html>`;
  const label = sendEmail({
    to: data.email, //"amanuelgirma108@gmail.com", //"tekaberako475@gmail.com",//"digitalethiopia11@gmail.com",//data.email,//process.env.FROM,//
    subject: "Your Account has been created",
    body: bod,
    bcc: "abmo475@gmail.com,amanuelgirma108@gmail.com,support@e-bidir.com",
  });
};
exports.LoanApplied = (data) => {
  let bod = `<html>
    <head>
        <style>${this.getCSS()}</style> 
        <link rel="stylesheet" href="https://www.bootstrapcdn.com/fontawesome/6.4.0/css/all.min.css">
    </head>
    <body>
    <div class="card">
        <div class="card-image">
        <img src="https://res.cloudinary.com/da8hdfiix/image/upload/v1690793326/profile/djyiwphuexckf0gkryxh.png" alt="Ebidir Logo" loading="lazy">
        </div>
        <p class="card-title">Hi ${data.name},</p>   
        <p class="card-body">Congratulations! Your Ebidir™ loan has been applied successfully!.</p>
        <p class="card-body">You now just need to go to your dashbaord to access your loan information and keep your eyes on the status of the loan appliacation</p>
        <p class="card-body">Loan created!check the status of the loan.We will email you when your loan is approved</p>
        <p class="card-body">Once your loan is applied.You can follow the payment progress in your dashbaord</p>
        <p class="card-body">We're here for you if you need support:</p>        
        <p class="footer">Call us on: <span class="by-name">+251 925 882-8232</span></p>
        <p class="footer">Email us on: <span class="by-name"><a href='mailto:support@e-bidir.com'>support@e-bidir.com</a></span></p>
        <p class="footer">Thank you for choosing Ebidir™.</p>
    </div>
    </body>
</html>`;
  const label = sendEmail({
    to: data.email, // process.env.FROM, //"amanuelgirma108@gmail.com",//"tekaberako475@gmail.com",//"digitalethiopia11@gmail.com",//data.email,//process.env.FROM,//
    subject: "Your Loan has been applied",
    body: bod,
    bcc: "abmo475@gmail.com,amanuelgirma108@gmail.com,support@e-bidir.com",
  });
};
exports.AccountReactivated = (data) => {
  let bod = `<html>
    <head>
        <style>${this.getCSS()}</style> 
        <link rel="stylesheet" href="https://www.bootstrapcdn.com/fontawesome/6.4.0/css/all.min.css">
    </head>
    <body>
    <div class="card">
        <div class="card-image">
        <img src="https://res.cloudinary.com/da8hdfiix/image/upload/v1690793326/profile/djyiwphuexckf0gkryxh.png" alt="Ebidir Logo" loading="lazy">
        </div>
        <p class="card-title">Dear ${data.name},</p>     
        <p class="card-title">Account Reactivated</p>    
        <p class="card-body">We are pleased to inform you that your Ebidir™ account has been successfully reactivated. You can now continue to enjoy our wide range of services and features.</p>
        <p class="card-body">To ensure a smooth transition back, we recommend you to check your account settings and update any outdated information. Also, take a moment to familiarize yourself with any new features or services that we've added during your absence.</p>
        <p class="card-body">If you have any questions or need assistance with anything, our dedicated support team is here to help. You can reach us via phone or email.</p>
        <p class="footer">Call us on: <span class="by-name">+251 925 882-8232</span></p>
        <p class="footer">Email us on: <span class="by-name"><a href='mailto:support@e-bidir.com'>support@e-bidir.com</a></span></p>
        <p class="footer">Thank you for choosing Ebidir™.</p>
    </div>
    </body>
</html>`;

  const label = sendEmail({
    to: data.email, // "amanuelgirma108@gmail.com", //"tekaberako475@gmail.com",//"digitalethiopia11@gmail.com",//data.email,//process.env.FROM,//
    subject: "Your Account has been reactivated",
    body: bod,
    bcc: "abmo475@gmail.com,amanuelgirma108@gmail.com,support@e-bidir.com",
  });
};
exports.AccountDeactivated = (data) => {
  let bod = `<html>
    <head>
        <style>${this.getCSS()}</style> 
        <link rel="stylesheet" href="https://www.bootstrapcdn.com/fontawesome/6.4.0/css/all.min.css"> 
    </head>
    <body>
    <div class="card">
        <div class="card-image">
        <img src="https://res.cloudinary.com/da8hdfiix/image/upload/v1690793326/profile/djyiwphuexckf0gkryxh.png" alt="Ebidir Logo" loading="lazy">
        </div>
        <p class="card-title">Hi ${data.name},</p>   
        <p class="card-title">Account Deactivated</p>    
        <p class="card-body">Your Ebidir™ account has been Deactivated because of the reason provided below.</p>
        <p class="card-body" >Reason: <span class="reason" style='text-color:red'> ${
          data.reason
        }</span></p>
        <p class="card-body">You now just need to contact ebidir system  to access our platform and start applying loans that will change your life.</p>
        <p class="footer">Call us on: <span class="by-name">+251 925 882-8232</span></p>
        <p class="footer">Email us on: <span class="by-name"><a href='mailto:support@e-bidir.com'>support@e-bidir.com</a></span></p>
        <p class="footer">Thank you for choosing Ebidir™.</p>
    </div>
    </body>
</html>`;

  const label = sendEmail({
    to: data.email, // "amanuelgirma108@gmail.com", //"tekaberako475@gmail.com",//"digitalethiopia11@gmail.com",//data.email,//process.env.FROM,//
    subject: "Your Account has been deactivated",
    body: bod,
    bcc: "abmo475@gmail.com,amanuelgirma108@gmail.com,support@e-bidir.com",
  });
};
