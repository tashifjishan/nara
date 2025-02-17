const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jishantales@gmail.com",
        pass: "xwqo dbdy pryq lxuh"
    }
});


const mailOptions = {
    from: "NARA jishantales@gmail.com",
    to: "divyabharti15012003@gmail.com",
    subject: "Test email",
    html: "This is a test message to check if everything works!"
}
transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err)
    else console.log(info.response)
})
