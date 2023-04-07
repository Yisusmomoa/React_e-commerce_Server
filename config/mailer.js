import nodemailer from 'nodemailer'
import 'dotenv/config'

const password=process.env.MAILER_PASSWORD
const user=process.env.MAILER_USER
// create reusable transporter object using the default SMTP transport
export const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, 
    secure: true, // true for 465, false for other ports
    auth: {
      user: user, // generated ethereal user
      pass: password, // generated ethereal password
    },
  });