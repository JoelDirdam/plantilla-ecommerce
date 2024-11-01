import User from "../../models/users.js";
import Pedido from "../../models/Pedidos.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { enviarMail } from "../EnviarMail.js";
dotenv.config();

export const EstadoPedido = async (req, res) => {
  const { nuevoEstado, id, token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token no proporcionado" });
  }

  try {
    // Verificar el token usando la clave secreta
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const email = decodedToken.email;

    // Encontrar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario tiene tipo de cuenta Admin
    if (user.tipoCuenta !== "Admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Buscar el pedido por ID
    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Actualizar el estado de envío si el nuevoEstado no está vacío
    if (nuevoEstado && nuevoEstado !== "") {
      pedido.estadoEnvio = nuevoEstado;
      await pedido.save();
    }
    // Crear el contenido del correo con los títulos, cantidades, tallas y colores de los productos
    const productosInfo = pedido.productos
      .map((p) => {
        const detallesTalla = p.talla ? `Talla: ${p.talla}` : "";

        // Mostrar color como un cuadrado de fondo si existe
        const colorDiv = p.color
          ? `<div style="width: 15px; height: 15px; border: 1px solid black; border-radius: 4px; background-color: ${p.color}; display: inline-block; margin-left: 10px;"></div>`
          : "";
        // Solo mostrar detalles si existen color o talla
        const detalles = [detallesTalla].filter(Boolean).join(", ");

        return `
        <div>
          ${p.titulo} - ${p.cantidad} unidades ${
          detalles ? `(${detalles})` : ""
        }
          ${colorDiv}
        </div>`;
      })
      .join("<br>");

    const correoContenido = `

     ${
       productosInfo.length > 1
         ? `<p>Productos: </p>${productosInfo}`
         : `<p>Producto: </p>${productosInfo}`
     }
      <br>
      <p>Gracias por su Compra.</p>
    `;
    const username = `${pedido.nombre} ${pedido.apellido} `;
    const correoContenidoRechazado = `

    ${
      productosInfo.length > 1
        ? `<p>Productos: </p>${productosInfo}`
        : `<p>Producto: </p>${productosInfo}`
    }
     <br>
     <p>Se le devolverá el dinero de su Compra, Le pedimos disculpas.</p>
   `;
    if (nuevoEstado === "Enviado") {
      enviarMail(
        pedido.email,
        username,
        "Su compra ha sido Enviada con Exito",
        correoContenido
      );
    } else if (nuevoEstado === "Entregado") {
      enviarMail(
        pedido.email,
        username,
        "Su compra ha sido Entregada con Exito",
        correoContenido
      );
    } else if (nuevoEstado === "Rechazado") {
      enviarMail(
        pedido.email,
        username,
        "Su Compra ha sido Rechazada",
        correoContenidoRechazado
      );
    }

    // Responder con el pedido actualizado
    res.status(200).json(pedido);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar el estado del pedido" });
  }
};
