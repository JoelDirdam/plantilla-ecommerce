import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { URL } from "../App";
import ModalEliminarPedido from "./ModalEliminarPedido";
export const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();

  return `${dia}/${mes}/${año}`;
};
// formateo Precio
export const formatearPrecio = (precio) => {
  if (typeof precio !== "number" || isNaN(precio)) {
    return "0"; // Retorna un valor predeterminado si el precio no es válido
  }

  // Formatear el número
  const opciones = {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  // Si el número tiene decimales distintos de 00, mostrarlos, de lo contrario, mostrar sin decimales
  return precio % 1 === 0
    ? precio.toLocaleString("es-AR", { ...opciones, minimumFractionDigits: 0 })
    : precio.toLocaleString("es-AR", opciones);
};
const PedidosList = ({ pedidos }) => {
  const [modalEliminarPedido, setModalEliminarPedido] = useState(false);
  const [filtroEstadoPago, setFiltroEstadoPago] = useState(""); // Filtro para el estado del pago
  const [filtroEstadoEnvio, setFiltroEstadoEnvio] = useState(""); // Filtro para el estado del envío
  const [ordenFecha, setOrdenFecha] = useState("recientes"); // Filtro para ordenar por fecha

  const handleFiltroPagoChange = (event) => {
    setFiltroEstadoPago(event.target.value);
  };

  const handleFiltroEnvioChange = (event) => {
    setFiltroEstadoEnvio(event.target.value);
  };

  const handleOrdenFechaChange = (event) => {
    setOrdenFecha(event.target.value);
  };

  const handleLimpiarFiltros = () => {
    setFiltroEstadoPago("");
    setFiltroEstadoEnvio("");
    setOrdenFecha("recientes");
  };

  // Filtrar y ordenar pedidos
  const pedidosFiltrados = pedidos
    .filter((pedido) => {
      const coincideEstadoPago =
        filtroEstadoPago === "" ||
        pedido.estadoTransaccion === filtroEstadoPago;
      const coincideEstadoEnvio =
        filtroEstadoEnvio === "" || pedido.estadoEnvio === filtroEstadoEnvio;

      return coincideEstadoPago && coincideEstadoEnvio;
    })
    .sort((a, b) => {
      if (ordenFecha === "recientes") {
        return new Date(b.createdAt) - new Date(a.createdAt); // De más reciente a más antiguo
      } else if (ordenFecha === "antiguos") {
        return new Date(a.createdAt) - new Date(b.createdAt); // De más antiguo a más reciente
      } else {
        return 0;
      }
    });

  return (
    <>
      <h1>Pedidos</h1>
      <hr />
      <div className="filtros-pedidos">
        <FormControl style={{ minWidth: "100%" }}>
          <InputLabel>Estado del Pago</InputLabel>
          <Select value={filtroEstadoPago} onChange={handleFiltroPagoChange}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="approved">Aprobado</MenuItem>
            <MenuItem value="in_process">En Proceso</MenuItem>
            <MenuItem value="rejected">Rechazado</MenuItem>
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: "100%" }}>
          <InputLabel>Estado del Envío</InputLabel>
          <Select value={filtroEstadoEnvio} onChange={handleFiltroEnvioChange}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Preparando">Preparando</MenuItem>
            <MenuItem value="Enviado">Enviado</MenuItem>
            <MenuItem value="Entregado">Entregado</MenuItem>
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: "100%" }}>
          <InputLabel>Ordenar por Fecha</InputLabel>
          <Select value={ordenFecha} onChange={handleOrdenFechaChange}>
            <MenuItem value="recientes">Más recientes primero</MenuItem>
            <MenuItem value="antiguos">Más antiguos primero</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleLimpiarFiltros}
        >
          Limpiar Filtros
        </Button>
      </div>
      <List>
        {pedidosFiltrados && pedidosFiltrados.length > 0 ? (
          <>
            {pedidosFiltrados.map((pedido) => (
              <ListItem key={pedido._id} divider>
                <ListItemText
                  primary={
                    <>
                      <Typography variant="h5">
                        {pedido.nombre} {pedido.apellido}
                      </Typography>
                      <Typography variant="h6">
                        Email Usuario: {pedido.emailUsuario}
                        <a
                          href={`/usuario/${pedido.idUsuario}`}
                          style={{ color: "black" }}
                        >
                          <i
                            className="fa-solid fa-up-right-from-square"
                            style={{
                              marginLeft: "1rem",
                              fontSize: "0.9rem",
                            }}
                          ></i>
                        </a>
                      </Typography>
                      <Typography variant="body2">
                        Email pedido: {pedido.email}
                      </Typography>
                      <Typography variant="body2">
                        Teléfono: {pedido.telefono}
                      </Typography>
                      <Typography variant="body2">
                        ID Transaccion:{" "}
                        <span style={{ color: "gray", fontWeight: "bold" }}>
                          {pedido.idTransaccion}
                        </span>
                      </Typography>
                      <Typography variant="h6">
                        Metodo Pago:{" "}
                        <span>{pedido.metodoPago.toUpperCase()}</span>
                      </Typography>
                      <Typography variant="body2">
                        Estado de la transacción:{" "}
                        {pedido.estadoTransaccion === "approved" ||
                        pedido.estadoTransaccion === "COMPLETED" ? (
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            Aprobado
                          </span>
                        ) : (
                          <span
                            style={{ color: "#c4cf20", fontWeight: "bold" }}
                          >
                            En Proceso
                          </span>
                        )}
                      </Typography>
                      <Typography variant="body2">
                        Total Pagado (con descuentos y/o envios): $
                        {formatearPrecio(pedido.totalPrecio)}
                      </Typography>
                      <Typography variant="body2">
                        Dirección: {pedido.direccion.calle}{" "}
                        {pedido.direccion.barrio} {pedido.direccion.provincia},{" "}
                        {pedido.direccion.pais}, {pedido.direccion.codigoPostal}{" "}
                        {pedido.direccion.apartamento}.
                      </Typography>
                      <Typography variant="body2">
                        Envío:{" "}
                        {pedido.estadoEnvio === "Preparando" ? (
                          <span style={{ color: "orange", fontWeight: "bold" }}>
                            Preparando
                          </span>
                        ) : pedido.estadoEnvio === "Enviado" ? (
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            Enviado
                          </span>
                        ) : pedido.estadoEnvio === "Entregado" ? (
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            Entregado
                          </span>
                        ) : pedido.estadoEnvio === "Rechazado" ? (
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            Rechazado
                          </span>
                        ) : null}
                      </Typography>
                      <Typography variant="body2">
                        Fecha del pedido: {formatearFecha(pedido.createdAt)}
                      </Typography>
                      <Typography variant="body2">Productos:</Typography>
                      <ul>
                        {pedido.productos.map((producto) => (
                          <div key={producto._id}>
                            <li style={{ cursor: "pointer" }}>
                              <a
                                href={`/producto/${producto.id}`}
                                style={{ color: "blue" }}
                              >
                                <img
                                  src={`${URL}${producto.imagen}`}
                                  alt={producto.titulo}
                                  className="img-pedidos"
                                />
                              </a>
                              <br />
                              <a
                                href={`/producto/${producto.id}`}
                                style={{ color: "blue" }}
                              >
                                <p className="producto-pedido">
                                  <span>
                                    ${formatearPrecio(producto.precio)} -
                                  </span>{" "}
                                  {producto.titulo} - Cantidad:{" "}
                                  {producto.cantidad}
                                  {producto.color && (
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "15px",
                                        height: "15px",
                                        marginLeft: "10px",
                                        backgroundColor: producto.color,
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                      }}
                                    ></span>
                                  )}
                                  {producto.talla && (
                                    <span style={{ marginLeft: "10px" }}>
                                      {" "}
                                      - Talla: {producto.talla}
                                    </span>
                                  )}
                                </p>
                              </a>
                            </li>
                            <a href={`/pedidos/${pedido._id}`}>
                              <button className="pedidos-list">
                                <i className="fa-solid fa-up-right-from-square"></i>
                              </button>
                            </a>
                            <button className="pedidos-list delete">
                              <i
                                className="fa-solid fa-trash"
                                onClick={() => setModalEliminarPedido(true)}
                              ></i>
                            </button>
                            <ModalEliminarPedido
                              setModalEliminarPedido={setModalEliminarPedido}
                              modalEliminarPedido={modalEliminarPedido}
                              id={pedido._id}
                            />
                          </div>
                        ))}
                      </ul>
                    </>
                  }
                />
              </ListItem>
            ))}
          </>
        ) : (
          <p>No se encontraron pedidos</p>
        )}
      </List>
    </>
  );
};

export default PedidosList;
