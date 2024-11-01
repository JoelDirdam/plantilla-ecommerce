import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { uploadImagenesInfoWeb } from "./uploadImagenesInfoWeb.js";
import connectDB from "./connect/connect.js";
import login from "./routes/login.js";
import perfil from "./routes/perfil.js";
import { uploadImagenes } from "./configMulter.js";
import findUsers from "./routes/findUsers.js";
// infoweb
import { editInfoWeb } from "./routes/infoWeb/editInfoWeb.js";
import orderInfoWeb from "./routes/infoWeb/orderInfoWeb.js";
// productos
import orderProductos from "./routes/Productos/orderProductos.js";
import deleteProductos from "./routes/Productos/deleteProductos.js";
import { eliminarProducto } from "./routes/Productos/eliminarProducto.js";
import { editProducto } from "./routes/Productos/editProducto.js";
import { agregarProducto } from "./routes/Productos/agregarProducto.js";
import clearInfoweb from "./routes/infoWeb/clearInfoWeb.js";
import { OrderPedidos } from "./routes/Productos/OrderPedidos.js";
import { EstadoPedido } from "./routes/Productos/EstadoPedido.js";
import { eliminarPedido } from "./routes/eliminarPedido.js";
import { EnviarMailsPublicidad } from "./routes/infoWeb/EnviarMailsPublicidad.js";

// Inicializa variables de entorno
dotenv.config();
const app = express();

// Conecta a la base de datos
await connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Reemplaza bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Reemplaza bodyParser.urlencoded()

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura la ruta para archivos estáticos
app.use(
  "/uploads/imagenesProductos",
  express.static(path.join(__dirname, "uploads", "imagenesProductos"))
);
app.use(
  "/uploads/portadas",
  express.static(path.join(__dirname, "uploads", "portadas"))
);
app.use(
  "/uploads/imagenesStoreInfo",
  express.static(path.join(__dirname, "uploads", "imagenesStoreInfo"))
);

// Configura las rutas
app.post("/login", login);
app.get("/perfil", perfil);
app.get("/find-users", findUsers);
app.post("/enviar-mails-publicidad", EnviarMailsPublicidad);
// productos
app.post("/estado-pedido", EstadoPedido);
app.delete("/eliminar-pedido", eliminarPedido);
app.get("/order-pedidos", OrderPedidos);
app.get("/order-productos", orderProductos);
app.delete("/eliminar-productos", deleteProductos);
app.delete("/delete-producto/:id/:token", eliminarProducto);
app.put(
  "/edit-producto",
  uploadImagenes.fields([
    { name: "imagenPortada", maxCount: 1 },
    { name: "variantes[0][imagen]", maxCount: 1 },
    { name: "variantes[1][imagen]", maxCount: 1 },
    { name: "variantes[2][imagen]", maxCount: 1 },
    { name: "variantes[3][imagen]", maxCount: 1 },
    { name: "variantes[4][imagen]", maxCount: 1 },
  ]),
  editProducto
);

app.post(
  "/agregar-productos",
  uploadImagenes.fields([
    { name: "imagenPortada", maxCount: 1 },
    { name: "variantes[0][imagen]" },
    { name: "variantes[1][imagen]" },
    { name: "variantes[2][imagen]" },
    { name: "variantes[3][imagen]" },
    { name: "variantes[4][imagen]" },
  ]),
  agregarProducto
);

app.get("/order-infoweb", orderInfoWeb);
app.delete("/clear-infoweb", clearInfoweb);
app.put(
  "/edit-infoWeb",
  uploadImagenesInfoWeb.fields([
    { name: "logo", maxCount: 1 },
    { name: "logoLight", maxCount: 1 },
    { name: "imagen1", maxCount: 1 },
    { name: "imagen2", maxCount: 1 },
    { name: "imagen3", maxCount: 1 },
    { name: "imagen4", maxCount: 1 },
    { name: "imagen5", maxCount: 1 },
  ]),
  editInfoWeb
);

// Server-side rendering
app.use(express.static(path.resolve(__dirname, "dist")));

app.get("*", async (req, res) => {
  try {
    const htmlFile = await readFile(
      path.resolve(__dirname, "dist", "index.html"),
      "utf8"
    );
    res.send(htmlFile);
  } catch (error) {
    console.error("Error leyendo el archivo index.html", error);
    res.status(500).send("Algo salió mal...");
  }
});

// Verificar funcionamiento del servidor
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

const PORT = process.env.PORT || 2018;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}!`);
});
