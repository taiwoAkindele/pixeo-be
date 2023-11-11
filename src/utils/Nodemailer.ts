import * as nodeMailer from "nodemailer";
import * as path from "path";
import * as fs from "fs";

const initiateTransport = () => {
  return nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_AUTH_USER,
      pass: process.env.GMAIL_AUTH_PASSWORD,
    },
  });
};

const sendMail = async (data: {
  to: string[];
  subject: string;
  htmlPath: string;
  userName: string;
  token: string;
  email?: string;
}): Promise<any> => {
  const transporter = initiateTransport();

  const emailHtmlPath = path.join(__dirname, data.htmlPath);
  const emailHtml = fs.readFileSync(emailHtmlPath, "utf-8");

  const personalizedHtml = emailHtml
    .replace("[user]", data.userName)
    .replace("[token]", data.token)
    .replace("[email]", data.email);

  const mailOptions = {
    from: " 'PIXEO'<no-reply@gmail.com>",
    to: data.to,
    subject: data.subject,
    html: personalizedHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

export default sendMail;
