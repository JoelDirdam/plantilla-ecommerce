import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: {
      calle: { type: String, required: true },
      barrio: { type: String, required: true },
      apartamento: { type: String },
      provincia: { type: String, required: true },
      pais: { type: String, required: true },
      codigoPostal: { type: String, required: true },
    },
    totalPrecio: { type: Number, required: true },
    productos: [
      {
        id: { type: String, required: true },
        codigoProducto: { type: String, required: true },
        titulo: { type: String, required: true },
        imagen: { type: String },
        descripcion: { type: String },
        precio: { type: Number, required: true },
        precioViejo: { type: Number },
        color: { type: String },
        talla: { type: String },
        cantidad: { type: Number, required: true },
      },
    ],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cuotaSeleccionada: {
      cantidad: { type: Number },
      montoPorCuota: { type: String },
      porcentajeInteres: { type: Number },
    },
    metodoPago: { type: String, required: true }, // 'Mercado Pago' o 'PayPal'
    idTransaccion: { type: String },
    estadoTransaccion: {
      type: String,
      default: "en proceso",
    },
    fechaTransaccion: { type: Date },
    montoTransaccionado: { type: Number },
    moneda: { type: String },
    autorizacion: { type: String },
    enlaceConfirmacion: { type: String },
    idCliente: { type: String },
    estadoEnvio: {
      type: String,
      default: "Preparando", // Valor predeterminado
    },
  },
  { timestamps: true }
);

const Pedido =
  mongoose.models.pedidos || mongoose.model("Pedido", pedidoSchema);

export default Pedido;
