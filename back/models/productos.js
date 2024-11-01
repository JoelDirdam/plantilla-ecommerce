import mongoose, { Schema, model } from "mongoose";

// Subesquema para manejar tallas, stock y precio dentro de cada color
const tallaSchema = new Schema({
  talla: { type: String }, // Nombre de la talla o memoria
  stock: { type: Number, default: 0 }, // Stock disponible para esta talla
  precio: { type: Number }, // Precio específico para esta talla (opcional)
});

// Esquema para manejar variantes por color
const variantSchema = new Schema({
  color: { type: String }, // Color del producto
  imagen: String, // URL de la imagen específica para este color
  tallas: [tallaSchema], // Array de tallas con stock y precios para este color
});

const cuotasSchema = new Schema({
  cantidad: { type: Number, required: true }, // Cantidad de cuotas
  porcentajeInteres: { type: Number, default: 0 }, // Porcentaje de interés
});

const productosSchema = new Schema(
  {
    codigoProducto: String,
    imagenPortada: String, // Imagen principal del producto (opcional)
    descripcion: String,
    titulo: String,
    precio: Number,
    precioViejo: { type: Number, default: 0 },
    porcentajeEnvio: { type: Number, default: 0 },
    sale: Boolean,
    categorias: [String], // Array de strings para categorías
    cantidadVendido: { type: Number, default: 0 },
    variantes: [variantSchema], // Variantes de color, talla, etc.
    cuotas: [cuotasSchema], // Opciones de cuotas
    cantidadStock: {
      porStock: { type: Boolean, default: false },
      cant: { type: Number, default: 0 },
    },

    estado: {
      type: String,
      enum: ["disponible", "agotado"],
      default: "disponible",
    },
  },
  { timestamps: true }
);

const Productos =
  mongoose.models.products || model("products", productosSchema);

export default Productos;
