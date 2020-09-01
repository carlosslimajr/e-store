const nodemailer = require('nodemailer') //configurando o email!

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "31421e43b962c2",
    pass: "4f62d788c5f948"
  }
});
//peguei no site mailtrap.io
module.exports = transport