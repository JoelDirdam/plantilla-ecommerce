import React from "react";
import { URL } from "../../App";

export default function ImagenesProducto({
  productoSelected,
  manejarMiniaturaClick,
  imagenSeleccionada,
  imagenPrincipal,
}) {
  return (
    <div>
      <div className="producto-imagenes">
        <div className="producto-miniaturas">
          <img
            src={`${URL}${productoSelected.imagenPortada}`}
            alt={`${productoSelected.titulo} - Portada`}
            className={`producto-miniatura ${
              imagenSeleccionada === productoSelected.imagenPortada
                ? "selected"
                : ""
            }`}
            onClick={() =>
              manejarMiniaturaClick(productoSelected.imagenPortada)
            }
          />
          {productoSelected.variantes.map((variante) => (
            <img
              key={variante._id}
              src={`${URL}${variante.imagen}`}
              alt={`${productoSelected.titulo} - Imagen ${variante._id}`}
              className={`producto-miniatura ${
                imagenSeleccionada === variante.imagen ? "selected" : ""
              }`}
              onClick={() => manejarMiniaturaClick(variante.imagen)}
            />
          ))}
        </div>
        {/* Imagen principal */}
        <div className="producto-imagen-principal-container">
          <img
            src={`${URL}${imagenPrincipal}`}
            alt={productoSelected.titulo}
            className="producto-imagen-principal"
          />

          {productoSelected.sale && <p>SALE</p>}
        </div>
      </div>
    </div>
  );
}
