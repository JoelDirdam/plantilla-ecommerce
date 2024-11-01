import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { formatearFecha, formatearPrecio } from "./PedidosList";
import { URL } from "../App";
import { notifyErroneo, notifyExitoso } from "../alerts/Alerts";
import ModalEliminarPedido from "./ModalEliminarPedido";

const estadosEnvio = ["Preparando", "Enviado", "Entregado", "Rechazado"];

const Pedido = ({ pedidos }) => {
  const { id } = useParams();
  const [modalEliminarPedido, setModalEliminarPedido] = useState(false);
  const [pedido, setPedido] = useState(pedidos.find((p) => p._id === id));
  const [nuevoEstado, setNuevoEstado] = useState(pedido?.estadoEnvio || "");
  const emailUsuarioBuscado = pedido?.emailUsuario || "";
  const handleEstadoChange = async (estadoEnvio) => {
    try {
      if (estadoEnvio === nuevoEstado) {
        return;
      }
      // return;
      const response = await axios.post(`${URL}/estado-pedido`, {
        nuevoEstado: nuevoEstado,
        id: pedido._id,
        token: JSON.parse(localStorage.getItem("TokenLogin")),
      });

      if (response.status === 200) {
        notifyExitoso("¡El Estado del Envío cambio con Exito!");
        setPedido({
          ...response.data,
          emailUsuario: emailUsuarioBuscado,
        });
      } else if (response.status === 205) {
        // notifyErroneo("¡Hubo un error al intentar cambiar el Envío!");
        localStorage.removeItem("TokenLogin");
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <ModalEliminarPedido
        setModalEliminarPedido={setModalEliminarPedido}
        modalEliminarPedido={modalEliminarPedido}
        id={pedido._id}
      />
      <button
        className="btn"
        onClick={() => (window.location.href = "/pedidos")}
      >
        Volver
      </button>{" "}
      <div
        className="container-productos pedido"
        style={{ position: "relative" }}
      >
        <h1 style={{ marginTop: "0" }}>Pedido</h1>
        <hr />
        {pedido ? (
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Detalles del Pedido
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>ID:</strong> {pedido._id}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Nombre:</strong> {pedido.nombre} {pedido.apellido}
              </Typography>
              <Typography variant="h6">
                <strong>Email Usuario:</strong> {pedido.emailUsuario}
                <a
                  href={`/usuario/${pedido.idUsuario}`}
                  style={{ color: "black" }}
                >
                  <i
                    className="fa-solid fa-up-right-from-square"
                    style={{ marginLeft: "1rem" }}
                  ></i>{" "}
                </a>
              </Typography>
              <Typography variant="h6">
                <strong>Email pedido:</strong> {pedido.email}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Teléfono:</strong> {pedido.telefono}
              </Typography>
              <Typography variant="h6">
                ID Transaccion:{" "}
                <span style={{ color: "gray", fontWeight: "bold" }}>
                  {pedido.idTransaccion}
                </span>
              </Typography>
              <Typography variant="h6">
                Metodo Pago: <span>{pedido.metodoPago}</span>
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Dirección:</strong> {pedido.direccion.calle},{" "}
                {pedido.direccion.barrio}, {pedido.direccion.provincia},{" "}
                {pedido.direccion.pais}, {pedido.direccion.codigoPostal}{" "}
                {pedido.direccion.apartamento}.
              </Typography>
              <Typography variant="h6">
                <strong>Total Pagado (con descuentos y/o envios): </strong>$
                {formatearPrecio(pedido.totalPrecio)}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Estado de Transacción:</strong>{" "}
                <span
                  style={{
                    color:
                      pedido.estadoTransaccion === "approved" ||
                      pedido.estadoTransaccion === "COMPLETED"
                        ? "green"
                        : "#c4cf20",
                    fontWeight: "bold",
                  }}
                >
                  {pedido.estadoTransaccion === "approved" ||
                  pedido.estadoTransaccion === "COMPLETED"
                    ? "Aprobado"
                    : "En Proceso"}
                </span>
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Estado de Envío:</strong>{" "}
                <span
                  style={{
                    color:
                      pedido.estadoEnvio === "Entregado"
                        ? "green"
                        : pedido.estadoEnvio === "Enviado"
                        ? // ? "#8B8000"
                          "blue"
                        : pedido.estadoEnvio === "Rechazado"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {pedido.estadoEnvio}
                </span>
              </Typography>
              <FormControl className="form-envio">
                <InputLabel>Actualizar Estado de Envío</InputLabel>
                <Select
                  defaultValue={nuevoEstado}
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  label="Actualizar Estado de Envío"
                >
                  {estadosEnvio.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
                <button
                  className="btn"
                  onClick={() => handleEstadoChange(pedido.estadoEnvio)}
                >
                  Cambiar
                </button>{" "}
                <strong>
                  El cambio de Estado a "enviado", "Entregado" o "Rechazado"
                  enviará aviso al usuario
                </strong>
              </FormControl>
              <Typography variant="h6" gutterBottom>
                <strong>Fecha del Pedido:</strong>{" "}
                {formatearFecha(pedido.createdAt)}
              </Typography>

              <Typography variant="h6" gutterBottom>
                <strong>Productos:</strong>
              </Typography>
              <List>
                {pedido.productos.map((producto, index) => (
                  <a
                    href={`/producto/${producto.id}`}
                    style={{ color: "blue", textDecoration: "none" }}
                  >
                    <ListItem key={index}>
                      <img
                        src={`${URL}${producto.imagen}`}
                        alt={producto.titulo}
                        className="img-pedidos"
                      />
                      <ListItemText
                        primary={
                          <Typography variant="body1" component="span">
                            {producto.titulo} - Cantidad: {producto.cantidad}
                          </Typography>
                        }
                        secondary={
                          <>
                            <span>${formatearPrecio(producto.precio)}</span>{" "}
                            {producto.color && (
                              <Typography variant="body2" component="span">
                                <strong>Color:</strong>{" "}
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: producto.color,
                                    borderRadius: "50%",
                                    border: "1px solid black",
                                    marginRight: "10px",
                                  }}
                                ></span>
                              </Typography>
                            )}
                            {producto.talla && (
                              <Typography variant="body2" component="span">
                                <strong>Talla:</strong> {producto.talla}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  </a>
                ))}
              </List>
              <button className="pedidos-list delete" style={{ top: "0" }}>
                <i
                  className="fa-solid fa-trash"
                  onClick={() => setModalEliminarPedido(true)}
                ></i>
              </button>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="h6" color="error">
            Pedido no encontrado.
          </Typography>
        )}
      </div>
    </Container>
  );
};

export default Pedido;
