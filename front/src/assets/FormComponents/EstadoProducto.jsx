import React from "react";

export default function EstadoProducto({ estado, setEstado }) {
  return (
    <div>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            value="disponible"
            checked={estado === "disponible"}
            onChange={() => setEstado("disponible")}
          />{" "}
          Disponible
        </label>
        <label>
          <input
            type="radio"
            value="agotado"
            checked={estado === "agotado"}
            onChange={() => setEstado("agotado")}
          />{" "}
          Agotado
        </label>
      </div>
    </div>
  );
}
