import React from "react";

export default function Cupones({ cupones, setCupones }) {
  const handleCouponChange = (index, field, value) => {
    const newCupones = [...cupones];
    newCupones[index][field] = value;
    setCupones(newCupones);
  };

  const addCoupon = () => {
    setCupones([...cupones, { nombre: "", porcentajeDescuento: 0 }]);
  };

  const removeCoupon = (index) => {
    setCupones(cupones.filter((_, i) => i !== index));
  };

  const clearCupones = () => {
    setCupones([]);
  };

  return (
    <>
      <label>
        <h3>Cupones</h3>
        {cupones.length > 0 ? (
          cupones.map((cupon, index) => (
            <div key={index} className="cupones">
              <div>
                <label htmlFor={`cupon-nombre-${index}`}>
                  Nombre
                  <input
                    type="text"
                    id={`cupon-nombre-${index}`}
                    value={cupon.nombre}
                    required
                    onChange={(e) =>
                      handleCouponChange(index, "nombre", e.target.value)
                    }
                  />
                </label>
                <label htmlFor={`cupon-descuento-${index}`}>
                  Descuento{" "}
                  <input
                    type="number"
                    id={`cupon-descuento-${index}`}
                    value={cupon.porcentajeDescuento}
                    onChange={(e) =>
                      handleCouponChange(
                        index,
                        "porcentajeDescuento",
                        e.target.value
                      )
                    }
                    min="0"
                    max="100"
                  />
                  %
                </label>
                <button
                  type="button"
                  onClick={() => removeCoupon(index)}
                  className="btn"
                >
                  Eliminar Cupón
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay cupones.</p>
        )}
        <button type="button" onClick={addCoupon} className="btn">
          Agregar Cupón
        </button>
        <button type="button" onClick={clearCupones} className="btn">
          Vaciar Cupones
        </button>
      </label>
    </>
  );
}
