import React, { useState } from "react";
import "./styles/usuarios.css";
import { formatearFecha } from "./PedidosList";

export default function Usuarios({ setUsers, users, pedidos }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Ordenar usuarios, colocando los "Admin" primero
  const sortedUsers = [...users].sort((a, b) =>
    a.tipoCuenta === "Admin" ? -1 : b.tipoCuenta === "Admin" ? 1 : 0
  );

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-productos">
      <h1>Usuarios</h1>
      <hr />
      <div className="buscardor-container">
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </div>
      </div>
      <div className="Lista-usuarios">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Tipo de Cuenta</th>
              <th>Pedidos</th>
              <th>Fecha Cuenta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <p className="active-text">
                    <strong>username: </strong>
                  </p>
                  <span> {user.username}</span>
                </td>
                <td>
                  <p className="active-text">
                    <strong>Email: </strong>
                  </p>{" "}
                  <span>{user.email}</span>
                </td>
                <td>
                  <p className="active-text">
                    <strong>Tipo Cuenta:</strong>
                  </p>
                  <span>{user.tipoCuenta}</span>
                </td>
                <td>
                  <p className="active-text">
                    <strong>Pedidos:</strong>
                  </p>
                  <span>{user.pedidos.length}</span>
                </td>
                <td>
                  <p className="active-text">
                    <strong>Fecha Cuenta:</strong>
                  </p>{" "}
                  <span>{formatearFecha(user.createdAt)}</span>
                </td>
                <td>
                  <a href={`/usuario/${user._id}`} style={{ color: "blue" }}>
                    <i className="fa-solid fa-up-right-from-square"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
