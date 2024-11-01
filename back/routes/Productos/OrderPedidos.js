import jwt from "jsonwebtoken";
import Pedido from "../../models/Pedidos.js";
import User from "../../models/users.js";
import dotenv from "dotenv";
dotenv.config();

export const OrderPedidos = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    // Verificar el token usando la clave secreta
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const email = decodedToken.email;

    // Encontrar al usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      // Si el usuario no es encontrado, responder con un mensaje
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario tiene tipo de cuenta Admin
    if (user.tipoCuenta !== "Admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Obtener los pedidos y poblar el campo de usuario
    const pedidos = await Pedido.find({});
    const pedidosConEmail = await Promise.all(
      pedidos.map(async (pedido) => {
        // Obtener el usuario asociado al pedido
        const usuario = await User.findById(pedido.usuario).exec();
        // Devolver el pedido con el email del usuario añadido

        return {
          ...pedido.toObject(),
          emailUsuario: usuario ? usuario.email : null,
          idUsuario: usuario ? usuario._id : null,
        };
      })
    );

    // Enviar los pedidos con el email del usuario asociado
    res.status(200).json(pedidosConEmail);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
