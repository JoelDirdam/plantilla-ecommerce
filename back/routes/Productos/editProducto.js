import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import Productos from "../../models/productos.js";
import { getFormattedDate } from "./agregarProducto.js";
import { ValidarToken } from "../ValidarToken.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagenesProductosDirectory = path.join(
  __dirname,
  "../../uploads/imagenesProductos"
);
const portadasDirectory = path.join(__dirname, "../../uploads/portadas");

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const sharpTransform = async (imageBuffer, filePath) => {
  await sharp(imageBuffer).webp({ quality: 80 }).toFile(filePath);
};

export const editProducto = async (req, res) => {
  try {
    const {
      id,
      descripcion,
      titulo,
      precio,
      precioViejo,
      sale,
      categorias = [],
      cantidadStock,
      estado,
      variantes = [],
      cuotas = [],
      porcentajeEnvio,
      token,
    } = req.body;
    if (!(await ValidarToken(token))) {
      return res.status(404).json({ error: "error en la petición" });
    }
    const cantidadStockObj = JSON.parse(cantidadStock);
    const cuotasArray = JSON.parse(cuotas || "[]");

    const productoExistente = await Productos.findById(id);

    if (!productoExistente) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    let portadaEnlace = productoExistente.imagenPortada;
    const formattedDate = getFormattedDate();

    // Actualizar portada si es proporcionada
    if (req.files && req.files["imagenPortada"]) {
      if (portadaEnlace) {
        const oldPortadaPath = path.join(
          __dirname,
          "../../uploads/portadas",
          path.basename(portadaEnlace)
        );
        deleteFile(oldPortadaPath);
      }

      const file = req.files["imagenPortada"][0];
      const ext = "webp";
      const fileName = `portada-${formattedDate}-${Math.round(
        Math.random() * 1e9
      )}.${ext}`;
      const filePath = path.join(portadasDirectory, fileName);
      portadaEnlace = `/uploads/portadas/${fileName}`;

      const imageBuffer = fs.readFileSync(file.path);
      await sharpTransform(imageBuffer, filePath);
      fs.unlinkSync(file.path);
    }

    // Eliminar imágenes antiguas si se han ingresado nuevas variantes
    if (variantes.length < productoExistente.variantes.length) {
      productoExistente.variantes.forEach((varianteExistente) => {
        if (varianteExistente.imagen) {
          const oldImagePath = path.join(
            __dirname,
            "../../uploads/imagenesProductos",
            path.basename(varianteExistente.imagen)
          );
          deleteFile(oldImagePath);
        }
      });
      productoExistente.variantes = []; // Vaciar el array de variantes
    }

    // Actualizar variantes
    let variantesActualizadas = variantes.map((nuevaVariante, index) => {
      const imagenField = req.files[`variantes[${index}][imagen]`];

      if (imagenField) {
        const file = imagenField[0];
        const ext = "webp";
        const fileName = `producto-${formattedDate}-${Math.round(
          Math.random() * 1e9
        )}.${ext}`;
        const filePath = path.join(imagenesProductosDirectory, fileName);

        const imageBuffer = fs.readFileSync(file.path);
        sharpTransform(imageBuffer, filePath);
        fs.unlinkSync(file.path);

        // Borrar la imagen antigua si existe
        if (productoExistente.variantes[index]?.imagen) {
          const oldImagePath = path.join(
            __dirname,
            "../../uploads/imagenesProductos",
            path.basename(productoExistente.variantes[index].imagen)
          );
          deleteFile(oldImagePath);
        }

        nuevaVariante.imagen = `/uploads/imagenesProductos/${fileName}`;
      } else {
        nuevaVariante.imagen = productoExistente.variantes[index]?.imagen;
      }

      // Si el color está vacío, limpiar el campo de tallas
      nuevaVariante.color = nuevaVariante.color?.trim() || "";
      if (!nuevaVariante.color) {
        nuevaVariante.tallas = []; // Vaciar el array de tallas si no hay color
      }

      return nuevaVariante;
    });
    // Limpiar y estructurar las categorías
    const categoriasArray = Array.from(
      new Set(categorias.split(",").map((cat) => cat.trim().toUpperCase()))
    );

    // Actualizar el resto del producto
    productoExistente.descripcion =
      descripcion || productoExistente.descripcion;
    productoExistente.titulo = titulo || productoExistente.titulo;
    productoExistente.precio = Number(precio) || productoExistente.precio;
    productoExistente.precioViejo =
      precioViejo || productoExistente.precioViejo;
    productoExistente.sale = sale;
    productoExistente.categorias =
      categoriasArray || productoExistente.categorias;
    productoExistente.estado = estado || productoExistente.estado;
    productoExistente.cuotas = cuotasArray || productoExistente.cuotas;
    productoExistente.imagenPortada =
      portadaEnlace || productoExistente.imagenPortada;
    productoExistente.variantes = variantesActualizadas;
    productoExistente.porcentajeEnvio = porcentajeEnvio;
    productoExistente.cantidadStock =
      cantidadStockObj || productoExistente.cantidadStock;

    // Guardar el producto actualizado
    await productoExistente.save();

    res.status(200).json({
      message: "Producto actualizado exitosamente",
      productoExistente,
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};
