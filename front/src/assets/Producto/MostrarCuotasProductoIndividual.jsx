import React from "react";
import { formatearPrecio } from "../../peticiones/findProductos";

// Función para calcular la cuota con interés
const calcularCuotaConInteres = (precio, interes, cantidadCuotas) => {
  if (!precio || !cantidadCuotas || interes === 0) {
    return (precio / cantidadCuotas).toFixed(2); // Sin interés
  }
  const interesDecimal = interes / 100;
  const cuotaConInteres = (precio * (1 + interesDecimal)) / cantidadCuotas;
  return cuotaConInteres.toFixed(2); // Redondear a dos decimales
};

const MostrarCuotasProductoIndividual = ({ precio, cuotas }) => {
  if (!precio || !Array.isArray(cuotas) || cuotas.length === 0) {
    return null; // No mostrar nada si no hay cuotas disponibles
  }

  return (
    <div style={{ color: "gray" }}>
      {cuotas.map((cuota) => {
        const { cantidad, porcentajeInteres } = cuota;
        const cuotaMensual = calcularCuotaConInteres(
          precio,
          porcentajeInteres,
          cantidad
        );

        return (
          <p key={cuota._id}>
            <strong>
              {cantidad} cuotas de{" "}
              <span>${formatearPrecio(parseFloat(cuotaMensual))}</span>{" "}
              {porcentajeInteres > 0
                ? `con ${porcentajeInteres}% de interés`
                : "sin interés"}
            </strong>
          </p>
        );
      })}
    </div>
  );
};

export default MostrarCuotasProductoIndividual;
