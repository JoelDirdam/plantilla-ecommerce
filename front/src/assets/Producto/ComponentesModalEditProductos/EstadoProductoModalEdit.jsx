import React from "react";

export default function EstadoProductoModalEdit({
  estado,
  setEstado,
  sale,
  setSale,
}) {
  return (
    <>
      <div className="checkbox">
        <input
          type="checkbox"
          checked={sale}
          id="sale"
          onChange={(e) => setSale(e.target.checked)}
        />
        <label htmlFor="sale">En oferta (SALE)</label>
      </div>
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
    </>
  );
}
