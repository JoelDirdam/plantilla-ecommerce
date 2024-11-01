import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import Productos from "../../models/productos.js";
import { ValidarToken } from "../ValidarToken.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagenesProductosDirectory = path.join(
  __dirname,
  "../../uploads/imagenesProductos"
);
const portadasDirectory = path.join(__dirname, "../../uploads/portadas");

// Función para generar un código de producto único
const generateProductCode = async () => {
  const randomId = Math.floor(1000 + Math.random() * 9000); // Número aleatorio de 4 dígitos
  const year = new Date().getFullYear(); // Año actual
  const code = `PROD-${year}-${randomId}`;

  // Verificar si el código ya existe en la base de datos
  const existingProduct = await Productos.findOne({ codigoProducto: code });
  if (existingProduct) {
    return generateProductCode(); // Generar un nuevo código si ya existe
  }

  return code;
};

// Función para generar SKU único
const generateSKU = (color, talla) => {
  const randomId = Math.floor(1000 + Math.random() * 9000); // Número aleatorio de 4 dígitos
  const colorPart = color ? color.toUpperCase().slice(0, 3) : "CLR";
  const tallaPart = talla ? talla.toUpperCase().slice(0, 3) : "TLL";
  return `${colorPart}-${tallaPart}-${randomId}`;
};

// Función para verificar si el SKU ya existe en la base de datos
const checkSKUExists = async (sku) => {
  const productWithSKU = await Productos.findOne({ "variantes.sku": sku });
  return !!productWithSKU;
};

// Función para generar SKU único para talla
export const generateUniqueSKUForTalla = async (color, talla) => {
  let sku = generateSKU(color, talla);
  while (await checkSKUExists(sku)) {
    sku = generateSKU(color, talla); // Generar un nuevo SKU si ya existe
  }
  return sku;
};

export const getFormattedDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}.${month}.${year}`;
};

export const agregarProducto = async (req, res) => {
  try {
    const {
      descripcion,
      titulo,
      precio,
      precioViejo,
      sale,
      categoria,
      cantidadStock,
      estado,
      variantes = [],
      cuotas = [], // Asegúrate de inicializar cuotas
      porcentajeEnvio,
      token,
    } = req.body;

    if (!(await ValidarToken(token))) {
      return res.status(404).json({ message: "token invalido" });
    }
    const cuotasArray = JSON.parse(cuotas);
    const cantidadStockObj = JSON.parse(cantidadStock);

    if (!fs.existsSync(imagenesProductosDirectory)) {
      fs.mkdirSync(imagenesProductosDirectory, { recursive: true });
    }
    if (!fs.existsSync(portadasDirectory)) {
      fs.mkdirSync(portadasDirectory, { recursive: true });
    }

    let portadaEnlace = null;
    const formattedDate = getFormattedDate();

    // Procesar imagen de portada
    if (req.files["imagenPortada"]) {
      const file = req.files["imagenPortada"][0];
      const ext = "webp";
      const fileName = `portada-${formattedDate}-${Math.round(
        Math.random() * 1e9
      )}.${ext}`;
      const filePath = path.join(portadasDirectory, fileName);
      portadaEnlace = `/uploads/portadas/${fileName}`;

      // Procesar y guardar imagen como webp
      const imageBuffer = fs.readFileSync(file.path);
      await sharp(imageBuffer).webp({ quality: 80 }).toFile(filePath);
      fs.unlinkSync(file.path);
    }

    // Procesar imágenes de variantes, asignar tallas y generar SKU
    for (let i = 0; i < variantes.length; i++) {
      const imageField = req.files[`variantes[${i}][imagen]`];
      if (imageField) {
        const file = imageField[0];
        const ext = "webp";
        const fileName = `producto-${formattedDate}-${Math.round(
          Math.random() * 1e9
        )}.${ext}`;
        const filePath = path.join(imagenesProductosDirectory, fileName);

        // Procesar y guardar imagen como webp
        const imageBuffer = fs.readFileSync(file.path);
        await sharp(imageBuffer).webp({ quality: 80 }).toFile(filePath);
        fs.unlinkSync(file.path);

        // Asignar la imagen a la variante correspondiente
        variantes[i].imagen = `/uploads/imagenesProductos/${fileName}`;
      }

      // Generar SKU único para cada talla en la variante
      const color = variantes[i].color;
      if (variantes[i].tallas && Array.isArray(variantes[i].tallas)) {
        for (const talla of variantes[i].tallas) {
          talla.sku = await generateUniqueSKUForTalla(color, talla.talla);
        }
      }

      // Asegurarse de que las tallas estén en mayúsculas y asignadas correctamente
      if (variantes[i].tallas && Array.isArray(variantes[i].tallas)) {
        variantes[i].tallas = variantes[i].tallas.map((talla) => ({
          talla: talla.talla.toUpperCase(), // Convertir la talla a mayúsculas
          stock: talla.stock,
          precio: talla.precio,
          sku: talla.sku, // Asignar SKU generado
        }));
      }
    }

    // Limpiar y estructurar las categorías
    const categoriasArray = Array.from(
      new Set(categoria.split(",").map((cat) => cat.trim().toUpperCase()))
    );

    // Generar un código  de producto único
    const codigoProducto = await generateProductCode();

    // Crear el nuevo producto con variantes y tallas
    const nuevoProducto = new Productos({
      codigoProducto, // Asignar el código de producto único
      imagenPortada: portadaEnlace,
      descripcion,
      titulo,
      porcentajeEnvio,
      precio: Number(precio),
      precioViejo: Number(precioViejo),
      sale: sale === "true",
      categorias: categoriasArray,
      cantidadVendido: 0,
      cantidadStock: cantidadStockObj,
      estado,
      variantes, // Usa el array con imágenes, tallas y SKU ya añadidos
      cuotas: cuotasArray, // Usa el array de cuotas ajustado
    });

    await nuevoProducto.save();

    res
      .status(201)
      .json({ message: "Producto agregado exitosamente", nuevoProducto });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
};
