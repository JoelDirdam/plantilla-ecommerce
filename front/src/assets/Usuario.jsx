import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PedidosList, { formatearFecha } from "./PedidosList";

export default function Usuario({ users, setUsers, pedidos }) {
  const [user, setUser] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (users) {
      const user = users.find((user) => user._id === id);
      if (user) {
        setUser(user);
      } else {
        navigate("/");
      }
    }
  }, [id, users, navigate]);
  // Filtrar los pedidos que coincidan con el user._id
  const filtrarPedidosUsuario = (userId) => {
    return pedidos.filter((pedido) => pedido.idUsuario === userId);
  };

  return (
    <div className="container">
      <button
        onClick={() => (window.location.href = "/usuarios")}
        className="btn"
      >
        Volver
      </button>
      {user && (
        <div className="container-productos" style={{ textAlign: "left" }}>
          <h1>Usuario {user.username}</h1>
          <hr />
          <div className="datos-Cuenta">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Usuario:</strong> {user.username}
            </p>
            <p>
              <strong>Pedidos:</strong> {user.pedidos.length}
            </p>
            <p>
              <strong>tipo de Cuenta:</strong> {user.tipoCuenta}
            </p>
            <p>
              <strong>Cuenta Creada:</strong> {formatearFecha(user.createdAt)}
            </p>
          </div>

          <div className="container-productos" style={{ textAlign: "left" }}>
            <PedidosList pedidos={filtrarPedidosUsuario(user._id)} />
          </div>
        </div>
      )}
    </div>
  );
}
