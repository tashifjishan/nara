const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jishantales@gmail.com",
        pass: "xwqo dbdy pryq lxuh"
    }
});

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    /* Basic Styles */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f7fc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
      text-align: center;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    .btn {
      display: block;
      width: 100%;
      background-color: #007bff;
      color: #ffffff;
      padding: 14px;
      text-align: center;
      text-decoration: none;
      font-size: 16px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .btn:hover {
      background-color: #0056b3;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      margin-top: 30px;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Email Verification</h1>
    <p>Hello,</p>
    <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
    <a href="{{verification_link}}" class="btn">Verify My Email</a>
    <p>If you did not sign up for this account, you can safely ignore this email.</p>
    <p>Thank you!</p>
    <p>Best regards,<br>NARA</p>
  </div>

  <div class="footer">
    <p>&copy; 2024 Nara. All rights reserved.</p>
  </div>

</body>
</html>
`
module.exports = (to, subject, message, req, res)=>{
  const mailOptions = {
    from: "NARA jishantales@gmail.com",
    to,
    subject,
    html: message
}
  transporter.sendMail(mailOptions, function(err, info){
      if(err) {
        console.log(err)
        res.status(500).json({status: "ERROR", message: "Sorry! We could not process your request right now!"})
      }
      else {
        res.status(200).json({status: "OK", message: "Email sent successfully!"})
      }
  })
}