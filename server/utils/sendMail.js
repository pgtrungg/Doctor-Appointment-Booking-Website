const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, html) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER || "pgtrungg@gmail.com",
            pass: process.env.EMAIL_PASS || "zwxq lpye wezw hxmz"
        },
    });

    let mailOptions = {
        from: "HUST Medical",
        to: email,
        subject: subject,
        html: html,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

module.exports = sendEmail;