import React, { useEffect, useState } from "react";
import "./styles/filtros.css"; // Añade tus estilos aquí

export default function FiltroAdicional({
  productosFiltrados,
  orden,
  setOrden,
}) {
  const [cantidadMostrada, setCantidadMostrada] = useState(
    productosFiltrados.length
  );

  useEffect(() => {
    // Actualiza la cantidad mostrada cuando cambien los productos filtrados
    setCantidadMostrada(productosFiltrados.length);
  }, [productosFiltrados]);

  const manejarCambioOrden = (e) => {
    setOrden(e.target.value);
  };

  return (
    <div className="filtros-adicionales">
      <p>Cantidad de Productos: {cantidadMostrada}</p>
      <select id="orden" value={orden} onChange={manejarCambioOrden}>
        <option value="default">Ordenar Por Defecto</option>
        <option value="popularidad">Ordenar Por Popularidad</option>
        <option value="fecha">Ordenar Por los Últimos</option>
        <option value="precio-bajo">Ordenar Por Precio: Bajo a Alto</option>
        <option value="precio-alto">Ordenar Por Precio: Alto a Bajo</option>
      </select>
    </div>
  );
}
