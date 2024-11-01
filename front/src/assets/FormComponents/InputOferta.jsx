import React from "react";

export default function InputOferta({ sale, setSale }) {
  return (
    <div>
      <div className="checkbox">
        <input
          type="checkbox"
          checked={sale}
          id="sale"
          onChange={(e) => setSale(e.target.checked)}
        />
        <label htmlFor="sale">En oferta (SALE)</label>
      </div>
    </div>
  );
}
