import mongoose from "mongoose";

const facturaSchema = new mongoose.Schema({
  codigoFactura: { type: String, required: true },
  fechaFactura: { type: Date, default: Date.now },
  total: { type: Number, required: true },
});

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tipoCuenta: { type: String, required: true },
    facturas: [facturaSchema], // Subdocumentos de facturas
    pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pedido" }], // Referencias a pedidos
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
