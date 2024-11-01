import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { getFormattedDate } from "../Productos/agregarProducto.js";
import StoreInfo from "../../models/StoreInfo.js";
import { ValidarToken } from "../ValidarToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagenesStoreInfoDirectory = path.join(
  __dirname,
  "../../uploads/imagenesStoreInfo"
);

// Crea los directorios si no existen
await fs.mkdir(imagenesStoreInfoDirectory, { recursive: true });

const procesarYGuardarImagen = async (file, prefix) => {
  const formattedDate = getFormattedDate();
  const fileName = `${prefix}-${formattedDate}-${Math.round(
    Math.random() * 1e9
  )}.webp`;
  const filePath = path.join(imagenesStoreInfoDirectory, fileName);

  try {
    await sharp(file.buffer).webp({ quality: 80 }).toFile(filePath);
    return `/uploads/imagenesStoreInfo/${fileName}`;
  } catch (error) {
    console.error(`Error al procesar el archivo ${file.originalname}:`, error);
    throw new Error("Error al procesar el archivo");
  }
};

const eliminarImagen = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Imagen eliminada: ${filePath}`);
  } catch (error) {
    console.error(`Error al eliminar la imagen ${filePath}:`, error);
  }
};

export const editInfoWeb = async (req, res) => {
  try {
    const { titulo, contacto, tipoEnvio, cupones, token } = req.body;
    if (!(await ValidarToken(token))) {
      return res
        .status(400)
        .json({ error: "Error al intentar hacer la petición" });
    }
    let tipoEnvioParsed;
    try {
      tipoEnvioParsed = JSON.parse(tipoEnvio);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "El formato de tipoEnvio es inválido" });
    }
    const banners = [];
    let logoEnlace = null;
    let logoLightEnlace = null;

    // Obtener la información de la tienda existente, si existe
    const existingStoreInfo = await StoreInfo.findOne({});

    // Eliminar imágenes antiguas si hay nuevos banners en la solicitud
    if (existingStoreInfo) {
      const bannersEnLaSolicitud = Object.keys(req.files).some((key) =>
        key.startsWith("imagen")
      );

      if (bannersEnLaSolicitud) {
        // Eliminar banners antiguos si hay nuevos banners
        if (existingStoreInfo.banners.length > 0) {
          await Promise.all(
            existingStoreInfo.banners.map((banner) =>
              eliminarImagen(
                path.join(
                  imagenesStoreInfoDirectory,
                  path.basename(banner.imagen)
                )
              )
            )
          );
        }
      }

      // Eliminar logos antiguos solo si se envían nuevos logos
      if (req.files.logo) {
        if (existingStoreInfo.logo) {
          await eliminarImagen(
            path.join(
              imagenesStoreInfoDirectory,
              path.basename(existingStoreInfo.logo)
            )
          );
        }
      } else if (existingStoreInfo.logo) {
        // No eliminar el logo si no se envía uno nuevo
        logoEnlace = existingStoreInfo.logo;
      }

      if (req.files.logoLight) {
        if (existingStoreInfo.logoLight) {
          await eliminarImagen(
            path.join(
              imagenesStoreInfoDirectory,
              path.basename(existingStoreInfo.logoLight)
            )
          );
        }
      } else if (existingStoreInfo.logoLight) {
        // No eliminar el logoLight si no se envía uno nuevo
        logoLightEnlace = existingStoreInfo.logoLight;
      }
    }

    // Procesar archivos y actualizar o crear nueva información
    for (const [key, files] of Object.entries(req.files)) {
      for (const file of files) {
        if (file.fieldname === "logo") {
          logoEnlace = await procesarYGuardarImagen(file, "logo");
        } else if (file.fieldname === "logoLight") {
          logoLightEnlace = await procesarYGuardarImagen(file, "logoLight");
        } else {
          const index = parseInt(file.fieldname.replace("imagen", "")) - 1;
          if (index >= 0) {
            const bannerEnlace = await procesarYGuardarImagen(
              file,
              `banner${index + 1}`
            );
            if (bannerEnlace) {
              banners.push({
                imagen: bannerEnlace,
                enlace: req.body[`enlace${index + 1}`] || null,
              });
            }
          }
        }
      }
    }

    // Procesar el contacto, asignando una cadena vacía si no se envían valores
    let contactoParsed;
    try {
      contactoParsed = JSON.parse(contacto);
      contactoParsed = {
        telefono: contactoParsed.telefono || "",
        email: contactoParsed.email || "",
        instagram: contactoParsed.instagram || "",
        WhatsApp: contactoParsed.WhatsApp || "",
      };
    } catch (error) {
      return res
        .status(400)
        .json({ error: "El formato de contacto es inválido" });
    }
    const cuponesArray = JSON.parse(cupones);

    // Actualizar o crear la entrada de la tienda
    const storeInfo = existingStoreInfo || new StoreInfo();

    storeInfo.titulo = titulo || storeInfo.titulo;
    storeInfo.logo = logoEnlace || storeInfo.logo;
    storeInfo.logoLight = logoLightEnlace || storeInfo.logoLight;
    storeInfo.contacto = contactoParsed;
    storeInfo.banners = banners.length > 0 ? banners : storeInfo.banners;
    storeInfo.tipoEnvio = tipoEnvioParsed || storeInfo.tipoEnvio;
    storeInfo.cupones = cuponesArray || storeInfo.cupones;

    await storeInfo.save();

    res.status(201).json({ message: "Información actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la información:", error);
    res.status(500).json({ error: "Error al actualizar la información" });
  }
};
