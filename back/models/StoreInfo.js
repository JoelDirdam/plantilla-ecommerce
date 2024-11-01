import mongoose, { Schema, model } from "mongoose";

const storeInfoSchema = new Schema(
  {
    logo: {
      type: String,
      default: null,
    },
    logoLight: {
      type: String,
      default: null,
    },
    titulo: {
      type: String,
      default: null,
    },

    tipoEnvio: {
      cantPrice: { type: Number, default: 0 },
      activeEnvio: { type: Boolean, default: false },
    },
    emailSubs: [{ email: String }],
    contacto: {
      telefono: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        default: null,
      },
      instagram: {
        type: String,
        default: null,
      },
      WhatsApp: {
        type: String,
        default: null,
      },
    },
    banners: [
      {
        imagen: {
          type: String,
          required: true,
        },
        enlace: {
          type: String,
          default: null,
        },
      },
    ],
    cupones: [
      {
        nombre: {
          type: String,
          required: true,
        },
        porcentajeDescuento: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      },
    ],
    visitantes: { type: Number, default: 0 }, // Asegúrate de definir el tipo y un valor por defecto
  },
  { timestamps: true, collection: "StoreInfo" }
);

const StoreInfo =
  mongoose.models.StoreInfo || model("StoreInfo", storeInfoSchema);

export default StoreInfo;
