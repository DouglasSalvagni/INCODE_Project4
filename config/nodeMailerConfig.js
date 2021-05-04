const { response } = require('express');
var nodemailer = require('nodemailer');

const user = "";
const pass = "";

const transporter = nodemailer.createTransport({
  host:'in-v3.mailjet.com',
  servide:'in-v3.mailjet.com',
  secure: true,
  port: 587,
  auth: {user,pass}
});

function emailRequest(){
  return transporter.sendMail({
    from: user,
    to: "douglassalvagni@gmail.com",
    replyTo:"contato@teste.com",
    subject: "Olá, seja bem vindo",
    text:"Olá, muito obrigado por se cadastrarna nossa plataforma"
  }, function(error){
      if (error) {
        console.log(error);
      } else {
        console.log('Email enviado com sucesso.');
      }
    });
}

module.exports = emailRequest;
