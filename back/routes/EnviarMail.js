import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { emailFooter } from "./infoWeb/EnviarMailsPublicidad.js";

dotenv.config();

// Configuración del servicio de correo electrónico
const transporter = nodemailer.createTransport({
  host: process.env.HOST_EMAIL, // tu correo electrónico
  port: process.env.PORT_EMAIL, // tu correo electrónico
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL, // tu correo electrónico
    pass: process.env.PASS, // tu contraseña de aplicación o correo
  },
});
const NOMBRE_EMPRESA = process.env.NOMBRE_EMPRESA;
const EMAIL_DE_ENVIO = process.env.EMAIL_DE_ENVIO;

export const enviarMail = async (
  email,
  username,
  tituloMessage,
  correoContenido
) => {
  try {
    // Send a welcome email
    const welcomeMailOptions = {
      from: `${NOMBRE_EMPRESA} <${EMAIL_DE_ENVIO}>`, // Dirección de envío personalizada
      to: email,
      subject: tituloMessage,
      html: `<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a ${NOMBRE_EMPRESA}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333333;
            text-align: center;
          }
          p {
            color: #555555;
            line-height: 1.6;
          }
          a {
            color: black;
            text-decoration: none;
          }
          a.button {
              color: white !important;
              text-decoration: none !important;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: black;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>¡Estado De su Pedido en ${NOMBRE_EMPRESA}!</h1>
          <p>Hola <strong>${username}</strong>,</p>
          <p>${tituloMessage}.</p>
          <p>${correoContenido}</p>
          <a href="${
            process.env.URL_TIENDA
          }/mi-cuenta" class="button">Accede al Contenido</a>
         ${emailFooter(EMAIL_DE_ENVIO)}
        </div>
      </body>
      </html>
    `,
    };
    transporter.sendMail(welcomeMailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Correo electrónico enviado:", info.response);
    });
  } catch (error) {
    console.error(error);
  }
};
