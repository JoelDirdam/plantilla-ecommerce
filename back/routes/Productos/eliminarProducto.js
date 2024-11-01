import fs from "fs/promises";
import path from "path";
import Productos from "../../models/productos.js";
import { fileURLToPath } from "url";
import { ValidarToken } from "../ValidarToken.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const eliminarProducto = async (req, res) => {
  try {
    const { id, token } = req.params; // Accediendo al ID desde req.params

    if (!(await ValidarToken(token))) {
      return res.status(404).json({ message: "Error con el token" });
    }
    console.log(await ValidarToken(token));

    // Buscar el producto antes de eliminarlo para obtener las rutas de las imágenes
    const producto = await Productos.findById(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar el producto de la base de datos
    const productoEliminado = await Productos.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res
        .status(404)
        .json({ message: "No se pudo eliminar el producto" });
    }

    // Rutas para las imágenes
    const portadasPath = path.join(__dirname, "../../uploads/portadas");
    const imagenesProductosPath = path.join(
      __dirname,
      "../../uploads/imagenesProductos"
    );

    // Función para eliminar imágenes
    const eliminarImagen = async (imagenPath) => {
      try {
        await fs.access(imagenPath); // Verificar si el archivo existe
        await fs.unlink(imagenPath); // Eliminar el archivo
        console.log(`Imagen eliminada correctamente: ${imagenPath}`);
      } catch (err) {
        console.error(`Error al eliminar la imagen: ${imagenPath}`, err);
      }
    };

    // 1. Eliminar imagen portada
    if (producto.imagenPortada) {
      // Quitar el prefijo '/uploads/' de la ruta
      const portadaNombre = producto.imagenPortada.replace(
        "/uploads/portadas/",
        ""
      );
      const portadaPath = path.join(portadasPath, portadaNombre);
      await eliminarImagen(portadaPath);
    }

    // 2. Eliminar imágenes de variantes
    if (producto.variantes) {
      for (const variante of producto.variantes) {
        if (variante.imagen) {
          // Quitar el prefijo '/uploads/' de la ruta
          const imagenNombre = variante.imagen.replace(
            "/uploads/imagenesProductos/",
            ""
          );
          const imagenPath = path.join(imagenesProductosPath, imagenNombre);
          await eliminarImagen(imagenPath);
        }
      }
    }

    res
      .status(200)
      .json({ message: "Producto y sus imágenes eliminados correctamente" });
  } catch (error) {
    console.error("Error al eliminar el producto y sus imágenes", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
