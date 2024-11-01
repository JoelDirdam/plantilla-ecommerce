import React, { useState } from "react";
import "./styles/filtros.css";

export default function Buscador({ onBuscar }) {
  const [texto, setTexto] = useState("");

  const manejarCambio = (e) => {
    setTexto(e.target.value);
    onBuscar(e.target.value);
  };

  return (
    <div className="buscador">
      <input
        type="text"
        placeholder="Buscar..."
        value={texto}
        onChange={manejarCambio}
      />
      <i className="fa-solid fa-magnifying-glass icono-buscador"></i>
    </div>
  );
}
