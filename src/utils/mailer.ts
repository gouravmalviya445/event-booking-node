import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import { ENV } from "../env";

let emailAPI = new TransactionalEmailsApi();
(emailAPI as any).authentications.apiKey.apiKey = ENV.brevoApiKey;

async function mailSender(
  email: string,
  subject: string,
  text: string,
  html: string,
) {
  try {
    let message = new SendSmtpEmail();
    message.subject = subject;
    message.textContent = text;
    message.htmlContent = html;
    message.sender = { name: "Gatherly 👻", email: ENV.brevoSender };
    message.to = [{ email: email }];
  
    return (await emailAPI.sendTransacEmail(message)).body;
  } catch (error: any) {
    console.log("Brevo email error:", error?.response?.data);
    throw Error("Failed to send mail");
  }
}

export { mailSender };
