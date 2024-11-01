import React from "react";

export default function PorStockModalEditProducto({
  porStock,
  handlePorStockChange,
  handleCantidadStockChange,
  cantidadStock,
}) {
  return (
    <div className="checkbox">
      <input
        type="checkbox"
        id="porStock"
        checked={porStock}
        onChange={handlePorStockChange}
      />
      <label htmlFor="porStock">Vender por stock en general</label>
      {porStock && (
        <input
          type="number"
          min="0"
          placeholder="Cantidad en stock"
          value={cantidadStock}
          onChange={handleCantidadStockChange}
        />
      )}
    </div>
  );
}
