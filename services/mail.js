const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

let sendMail = (email, accessCode) => {
  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: email,
      subject: "Access Code",
      text: accessCode,
    },
    (err, info) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

let sendMailDownload = (email, ip, file) => {
  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Notification",
    text: `Hey ${ip} has just downloaded the file - ${file}`,
  });
};

module.exports = { sendMail, sendMailDownload };
