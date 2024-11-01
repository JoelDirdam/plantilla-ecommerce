import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { getFormattedDate } from "./routes/Productos/agregarProducto.js";

// Resolución de __dirname usando fileURLToPath para ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Verifica y crea las carpetas si no existen
const createDirectoryIfNotExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};
const imagenesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determina la carpeta de destino basado en el campo de archivo
    // if(file.fieldname === "")
    const destination =
      file.fieldname === "imagenPortada"
        ? path.join(__dirname, "uploads", "portadas")
        : path.join(__dirname, "uploads", "imagenesProductos");
    createDirectoryIfNotExists(destination);

    cb(null, destination);
  },

  filename: (req, file, cb) => {
    const formattedDate = getFormattedDate();
    // const ext = file.originalname.split(".").pop();
    const ext = "webp";
    const prefix =
      file.fieldname === "imagenPortada" ? "portada-" : "producto-";
    cb(
      null,
      `${prefix}-${formattedDate}-${Math.round(Math.random() * 1e9)}.${ext}`
    );
  },
});

const uploadImagenes = multer({
  storage: imagenesStorage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"), false);
    }
  },
});

export { uploadImagenes };
