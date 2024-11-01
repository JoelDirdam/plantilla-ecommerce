import React, { useState, useEffect } from "react";

export default function PorCuotasEditModalProductos({ cuotasProd, setCuotas }) {
  const [cuotas, setCuotasState] = useState({
    3: { habilitada: false, porcentajeInteres: 0 },
    6: { habilitada: false, porcentajeInteres: 0 },
    12: { habilitada: false, porcentajeInteres: 0 },
  });

  // Inicializar el estado basado en cuotasProd
  useEffect(() => {
    if (cuotasProd && cuotasProd.length > 0) {
      const initialCuotas = {
        3: { habilitada: false, porcentajeInteres: 0 },
        6: { habilitada: false, porcentajeInteres: 0 },
        12: { habilitada: false, porcentajeInteres: 0 },
      };

      cuotasProd.forEach((cuota) => {
        initialCuotas[cuota.cantidad] = {
          habilitada: true,
          porcentajeInteres: cuota.porcentajeInteres,
        };
      });

      setCuotasState(initialCuotas);
    }
  }, [cuotasProd]);

  // Actualizar el estado de las cuotas seleccionadas
  useEffect(() => {
    const cuotasArray = Object.keys(cuotas)
      .filter((cantidad) => cuotas[cantidad].habilitada)
      .map((cantidad) => ({
        cantidad: Number(cantidad),
        porcentajeInteres: cuotas[cantidad].porcentajeInteres,
      }));
    setCuotas(cuotasArray);
  }, [cuotas, setCuotas]);

  const handleCheckboxChange = (cantidad) => {
    setCuotasState((prev) => ({
      ...prev,
      [cantidad]: {
        ...prev[cantidad],
        habilitada: !prev[cantidad].habilitada, // Cambiar habilitada
      },
    }));
  };

  const handleInteresChange = (cantidad, e) => {
    const newPorcentajeInteres = Math.max(Number(e.target.value), 0);
    setCuotasState((prev) => ({
      ...prev,
      [cantidad]: {
        ...prev[cantidad],
        porcentajeInteres: newPorcentajeInteres, // Cambiar porcentajeInteres
      },
    }));
  };

  return (
    <div className="en-cuotas-container">
      {[3, 6, 12].map((cantidad) => (
        <div key={cantidad} className="cuotas-producto">
          <label>
            <input
              type="checkbox"
              checked={cuotas[cantidad].habilitada}
              onChange={() => handleCheckboxChange(cantidad)}
            />
            {cantidad} cuotas
          </label>

          {cuotas[cantidad].habilitada && (
            <div>
              <label>
                <span>
                  Porcentaje de interés para {cantidad} cuotas (dejar en 0 si
                  son cuotas sin interés):
                </span>{" "}
                <br />
                <input
                  type="number"
                  value={cuotas[cantidad].porcentajeInteres}
                  onChange={(e) => handleInteresChange(cantidad, e)}
                  min="0"
                  step="0.01"
                />{" "}
                %
              </label>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
