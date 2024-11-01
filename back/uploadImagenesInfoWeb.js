import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { getFormattedDate } from "./routes/Productos/agregarProducto.js";

// Configuración de multer para almacenamiento en memoria
const storage = multer.memoryStorage();

export const uploadImagenesInfoWeb = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Límite de tamaño del archivo (50MB)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"), false);
    }
  },
});

// Resuelve __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveImageWithSharp = async (file, prefix) => {
  const formattedDate = getFormattedDate();
  const filename = `${prefix}-${formattedDate}-${Math.round(
    Math.random() * 1e9
  )}.webp`;

  const uploadDir = path.join(__dirname, "uploads", "imagenesStoreInfo");

  // Crea el directorio si no existe
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);

  // Procesa la imagen y la guarda en formato WebP
  await sharp(file.buffer).webp({ quality: 80 }).toFile(filepath);

  return filename;
};
