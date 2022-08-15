const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });

const sender_email = "lalalivecs@gmail.com";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sender_email,
    pass: "wtijnsbsiaazpblf",
  },
});

exports.sendForgotEmail = async function (token, user) {
  transport
    .sendMail({
      from: sender_email,
      to: user.email,
      subject: "Reset your password",
      html: `<h1><b>Hello ${user.username} !</b></h1>

                <h4><i>You're on your way!</i></h4>
                <h5>Let's reset your password</h5>
                <p>By clicking on the following link, you can reset your password.</p>
                <a href="${process.env.BASE_URL}/user/resetpassword?token=${token}"><b><i> Reset Password </i></b></a>`,
    })
    .then(() => {
      console.log("Email Sent to " + user.email + " for Reset Password");
    })
    .catch((err) => {
      console.log(
        "Email Not Sent to " + user.email + " for Reset Password");
      console.log(err);

    });
};

//contactUsEmail
exports.contactUsEmail = async function (newContact, adminEmail) {
  transport
    .sendMail({
      from: sender_email,
      to: adminEmail,
      subject: `${newContact.subject}`,
      html: `<h1><b>${newContact.type} !</b></h1>
                <p>${newContact.description}</p>
                <img src="${newContact.uploadFile}" alt="No any additional source" style="vertical-align:middle;margin:0px 50px; width:300px; height:250px;"/>
                `,
    })
    .then(() => {
      console.log("Email Sent to admin");
    })
    .catch((err) => {
      console.log(
        "Email Not Sent to admin ");
      console.log(err);

    });
};