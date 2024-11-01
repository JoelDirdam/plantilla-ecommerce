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

const MostrarCuotas = ({ precio, cuotas }) => {
  if (!precio || !Array.isArray(cuotas) || cuotas.length === 0) {
    return null; // No mostrar nada si no hay cuotas disponibles
  }

  // Filtrar cuotas sin interés
  const cuotasSinInteres = cuotas.filter(
    (cuota) => cuota.porcentajeInteres === 0
  );
  // Filtrar cuotas con interés
  const cuotasConInteres = cuotas.filter(
    (cuota) => cuota.porcentajeInteres > 0
  );

  // Lógica para mostrar solo una opción de cuotas
  if (cuotasSinInteres.length > 0) {
    // Mostrar la opción con la mayor cantidad de cuotas sin interés
    const maxCuotasSinInteres = Math.max(
      ...cuotasSinInteres.map((c) => c.cantidad)
    );
    // Calcular el valor de cada cuota sin interés
    const valorCuotaSinInteres = (precio / maxCuotasSinInteres).toFixed(2);

    return (
      <p style={{ color: "#15d67d" }}>
        <strong>
          Hasta {maxCuotasSinInteres} cuotas{" "}
          <span>${formatearPrecio(parseFloat(valorCuotaSinInteres))}</span> sin
          interés
        </strong>
      </p>
    );
  } else if (cuotasConInteres.length > 0) {
    // Si no hay cuotas sin interés, mostrar la opción con menor porcentaje de interés
    const mejorCuotaConInteres = cuotasConInteres.reduce((mejor, cuota) =>
      cuota.porcentajeInteres < mejor.porcentajeInteres ? cuota : mejor
    );

    const cuotaMensual = calcularCuotaConInteres(
      precio,
      mejorCuotaConInteres.porcentajeInteres,
      mejorCuotaConInteres.cantidad
    );

    return (
      <p style={{ color: "#15d67d" }}>
        <strong>
          {mejorCuotaConInteres.cantidad} cuotas de ${" "}
          {formatearPrecio(parseFloat(cuotaMensual))} con{" "}
          {mejorCuotaConInteres.porcentajeInteres}% de interés
        </strong>
      </p>
    );
  }

  return null; // Si no hay cuotas sin interés ni con interés, no mostrar nada
};

export default MostrarCuotas;
