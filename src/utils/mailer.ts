import nodemailer from "nodemailer";
import { ENV } from "../env";

const transporter = nodemailer.createTransport({
  host: ENV.smtpHost,
  port: parseInt(ENV.smtpPort),
  secure: false, // use false for port 587
  auth: {
    user: ENV.smtpUser,
    pass: ENV.smtpPass
  }
})

async function mailSender(email: string, subject: string, text: string, html: string) {
  try {
    return await transporter.sendMail({
      from: `"Gatherly 👻" <${ENV.smtpSender}>`,
      to: email,
      subject: subject,
      html: html,
    })
  } catch (error) {
    throw new Error("Error sending email");
  }  
}

export {
  mailSender
}