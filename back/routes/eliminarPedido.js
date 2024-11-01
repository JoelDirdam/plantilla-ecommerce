import Pedido from "../models/Pedidos.js";
import { ValidarToken } from "./ValidarToken.js";

export const eliminarPedido = async (req, res) => {
  try {
    const { id, token } = req.query;

    if (!(await ValidarToken(token))) {
      res.status(206).json({ message: "¡El token es invalido!" });
    }
    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(205).json({ message: "Producto no encontrado" });
    }
    // Eliminar el producto de la base de datos
    const productoEliminado = await Pedido.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res
        .status(205)
        .json({ message: "No se pudo eliminar el producto" });
    }
    res.status(200).json({ message: "Pedido Eiminado" });
  } catch (error) {
    console.error(error);
  }
};
