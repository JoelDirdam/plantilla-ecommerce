import StoreInfo from "../../models/StoreInfo.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ValidarToken } from "../ValidarToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to clear specific StoreInfo data and delete images
const clearInfoweb = async (req, res) => {
  const { token } = req.query;
  if (!(await ValidarToken(token))) {
    res.status(404).json({ message: "No hay información para actualizar." });
    return;
  }

  try {
    // Update all documents in the StoreInfo collection to clear specified fields
    const result = await StoreInfo.updateMany(
      {},
      {
        $set: {
          logo: null,
          logoLight: null,
          titulo: null,
          tipoEnvio: {
            cantPrice: 0,
            activeEnvio: false,
          },
          contacto: {
            telefono: null,
            email: null,
            instagram: null,
            WhatsApp: null,
          },
          banners: [], // Empty the array of banners
        },
      }
    );

    // Log if no documents were found to update
    if (result.modifiedCount === 0) {
      res.status(205).json({ message: "No hay información para actualizar." });
      return;
    }

    // Path to the folder containing the images
    const directoryPath = path.join(
      __dirname,
      "../../uploads/imagenesStoreInfo"
    );

    // Check if the directory exists
    if (fs.existsSync(directoryPath)) {
      // Read all the files in the directory
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Error leyendo la carpeta:", err);
          res.status(500).json({ error: "Error eliminando imágenes." });
          return;
        }

        // Delete each file in the directory
        for (const file of files) {
          const filePath = path.join(directoryPath, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Failed to delete image: ${file}`, err);
            }
          });
        }

        res.status(200).json({
          message:
            "Información actualizada y todas las imágenes eliminadas correctamente.",
        });
      });
    } else {
      res.status(200).json({
        message:
          "Información actualizada, pero no se encontraron imágenes para eliminar.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Problema al actualizar la información." });
  }
};

export default clearInfoweb;
