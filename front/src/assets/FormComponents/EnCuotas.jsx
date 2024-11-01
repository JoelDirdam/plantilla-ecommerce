import React, { useState, useEffect } from "react";

export default function EnCuotas({ setCuotas }) {
  const [cuotas, setCuotasState] = useState({
    3: { porcentajeInteres: 0, habilitada: false },
    6: { porcentajeInteres: 0, habilitada: false },
    12: { porcentajeInteres: 0, habilitada: false },
  });

  useEffect(() => {
    // Guardar las cuotas habilitadas, independientemente de si tienen interés o no
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
        habilitada: !prev[cantidad].habilitada,
      },
    }));
  };

  const handleInteresChange = (cantidad, e) => {
    const newPorcentajeInteres = Math.max(Number(e.target.value), 0); // Permitir 0
    setCuotasState((prev) => ({
      ...prev,
      [cantidad]: {
        ...prev[cantidad],
        porcentajeInteres: newPorcentajeInteres,
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
              checked={cuotas[cantidad].habilitada || false}
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
