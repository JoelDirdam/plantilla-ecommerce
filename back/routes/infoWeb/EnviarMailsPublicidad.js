import { ValidarToken } from "../ValidarToken.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// emailFooter.js
export const emailFooter = (email) => `
  <div class="footer">
    <p>Para más información, contáctanos en <a href="mailto:${email}">${email}</a>.</p>
    <p>Si recibiste este mensaje por error, por favor ignóralo.</p>
  </div>
`;

// Configuración del servicio de correo electrónico
const transporter = nodemailer.createTransport({
  host: process.env.HOST_EMAIL, // tu servidor de correo
  port: process.env.PORT_EMAIL, // puerto del servidor de correo
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL, // tu correo electrónico
    pass: process.env.PASS, // tu contraseña de aplicación o correo
  },
});

export const EnviarMailsPublicidad = async (req, res) => {
  try {
    const { titulo, emails, subject, message, link, token } = req.body;

    if (!(await ValidarToken(token))) {
      return res.status(404).json({ error: "¡Error en el Token ingresado!" });
    }

    const NOMBRE_EMPRESA = process.env.NOMBRE_EMPRESA;
    const EMAIL_DE_ENVIO = process.env.EMAIL_DE_ENVIO;
    // Iterar sobre cada email
    for (const email of emails) {
      const mailOptions = {
        from: `${NOMBRE_EMPRESA} <${EMAIL_DE_ENVIO}>`,
        to: email,
        subject: subject || titulo,
        html: `<!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject || titulo}</title>
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
            <h1>${titulo}</h1>
            <p>${message}.</p>
            ${
              link &&
              `<a href="${link}" class="button">
                  Accede al Contenido
                </a>`
            }
             ${emailFooter(EMAIL_DE_ENVIO)}
          </div>
        </body>
        </html>`,
      };

      // Enviar el correo
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        console.log("Correo electrónico enviado:", info.response);
      });
    }

    return res.status(200).json({ message: "Correos enviados correctamente." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al enviar los correos." });
  }
};
