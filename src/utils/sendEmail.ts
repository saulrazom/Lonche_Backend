import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';

export const sendEmail = (to: string, user: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    //debug: true,
    //logger: true,
  });

  const file = fs.readFileSync(
    path.join(__dirname, '..', 'views', 'mail.template.html')
  );
  const html = file
    .toString()
    .replace('{{username}}', user)
    .replace('{{app_url}}', process.env.WEB_URL as string);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: '¡Bienvenido a Lonche!',
    text: `Bienvenido a Lonche, ${user}, parece que tu proveedor de correo no soporta HTML`,
    html,
  };

  return transporter.sendMail(mailOptions).then(() => {
    console.log('Email sent successfully to:', to);
  });
};
