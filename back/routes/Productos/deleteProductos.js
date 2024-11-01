import fs from "fs";
import path from "path";
import Productos from "../../models/productos.js";
import { fileURLToPath } from "url";
import { ValidarToken } from "../ValidarToken.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to handle deleting all products and their images
const deleteProductos = async (req, res) => {
  try {
    const { token } = req.query;
    if (!(await ValidarToken(token))) {
      res.status(404).json({ message: "No products found to delete" });
      return;
    }

    // Retrieve all products
    const productos = await Productos.find({});

    if (productos.length === 0) {
      res.status(205).json({ message: "No products found to delete" });
      return;
    }
    // Iterate over each product to delete its images
    for (const producto of productos) {
      // Delete main image (portada)
      if (producto.imagenPortada) {
        const imageName = path.basename(producto.imagenPortada); // Only get the filename
        const imagePath = path.join(
          __dirname,
          "../../uploads/portadas",
          imageName
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(
              `Failed to delete portada image: ${producto.imagenPortada}`,
              err
            );
          }
        });
      }
      // Suponiendo que `producto` es el resultado de una consulta a la base de datos.
      if (producto && producto && producto.variantes) {
        const variantes = producto.variantes;
        if (variantes.length > 0) {
          for (const variante of variantes) {
            const imagen = variante.imagen;
            if (imagen) {
              const imageName = path.basename(imagen); // Obtén solo el nombre del archivo
              const imagePath = path.join(
                __dirname,
                "../../uploads/imagenesProductos",
                imageName
              );

              // Verifica si el archivo existe antes de intentar eliminarlo
              fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (err) {
                  console.error(`File does not exist: ${imagePath}`);
                  return;
                }

                fs.unlink(imagePath, (err) => {
                  if (err) {
                    console.error(
                      `Failed to delete imagenProducto image: ${imagen}`,
                      err
                    );
                  } else {
                    console.log(`Successfully deleted image: ${imagen}`);
                  }
                });
              });
            }
          }
        }
      } else {
        console.log("No variantes found or producto is undefined");
      }
    }

    // Delete all products from the database
    const result = await Productos.deleteMany({});
    res.status(200).json({
      message: "All products and their images were deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    // Log any errors and send a response indicating a server error
    console.log(error);
    res.status(500).json({
      error: "An error occurred while deleting products and their images",
    });
  }
};

export default deleteProductos;
