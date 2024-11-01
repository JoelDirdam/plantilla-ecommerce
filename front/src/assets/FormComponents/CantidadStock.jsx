import React from "react";
import { notifyEsperando } from "../../alerts/Alerts";

export default function CantidadStock({
  porStock,
  setPorStock,
  cantidadStock,
  setCantidadStock,
}) {
  const handleCantidadStockChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setCantidadStock(value);
    } else {
      setCantidadStock(1);
      notifyEsperando("La cantidad en stock no puede ser menor que 1.");
    }
  };
  return (
    <div>
      <div className="checkbox">
        <input
          type="checkbox"
          id="porStock"
          checked={porStock}
          onChange={(e) => setPorStock(e.target.checked)}
        />
        <label htmlFor="porStock">Vender por stock en general</label>
        {porStock && (
          <input
            type="number"
            min="1"
            placeholder="Cantidad en stock"
            value={cantidadStock}
            onChange={handleCantidadStockChange}
          />
        )}
      </div>
    </div>
  );
}
