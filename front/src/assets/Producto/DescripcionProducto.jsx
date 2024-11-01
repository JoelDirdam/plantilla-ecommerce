import React from "react";

// Función para ordenar las tallas
const ordenarTallas = (tallas) => {
  return tallas.sort((a, b) => {
    const tallaA = a.talla.toString();
    const tallaB = b.talla.toString();

    // Extraer el número y la unidad (si la hay) de las tallas
    const extraerNumero = (talla) => parseInt(talla.match(/\d+/)?.[0] || 0, 10);
    const extraerUnidad = (talla) => talla.replace(/\d+/g, "").trim();

    const numeroA = extraerNumero(tallaA);
    const numeroB = extraerNumero(tallaB);

    const unidadA = extraerUnidad(tallaA);
    const unidadB = extraerUnidad(tallaB);

    // Comparar por unidad primero (alfabéticamente)
    if (unidadA !== unidadB) {
      return unidadA.localeCompare(unidadB);
    }

    // Comparar por número si las unidades son iguales
    return numeroA - numeroB;
  });
};

export default function DescripcionProducto({
  seleccionFinal,
  productoSelected,
  handleColorClick,
  handleTallaClick,
  colorSeleccionado,
  tallasDisponibles,
}) {
  // Filtrar variantes que tienen color definido
  const variantesConColor = productoSelected.variantes.filter(
    (variant) => variant.color !== ""
  );

  // Ordenar las tallas disponibles
  const tallasOrdenadas = ordenarTallas(tallasDisponibles);

  return (
    <div style={{ color: "gray", fontWeight: "bold" }}>
      {/* Mostrar solo si hay un color seleccionado */}
      {colorSeleccionado && (
        <>
          {colorSeleccionado.color && colorSeleccionado.color != "null" && (
            <p style={{ display: "flex", gap: "0.5rem" }}>
              Color:{" "}
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: colorSeleccionado.color,
                  border: "1px solid black",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              ></span>
            </p>
          )}

          {/* Mostrar talla y stock */}
          {colorSeleccionado.tallas && colorSeleccionado.tallas.length > 0 && (
            <div>
              <p>
                Talle:{" "}
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {seleccionFinal.talla}
                </span>
                <br />
                {/* Buscar el stock de la talla seleccionada */}
              </p>
              <p>
                Stock:{" "}
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {colorSeleccionado.tallas.find(
                    (talla) => talla.talla === seleccionFinal.talla
                  )?.stock || "Sin Stock"}
                </span>
              </p>
            </div>
          )}
        </>
      )}

      <div>
        {/* Verificar si hay variantes con color */}
        {variantesConColor.length > 0 && (
          <div className="variantes-producto">
            {/* Mostrar colores */}
            <div>
              {variantesConColor
                .filter(
                  (variant) =>
                    variant.color &&
                    variant.color !== "null" &&
                    variant.color.trim() !== ""
                )
                .map((variant, index) => (
                  <div
                    key={index}
                    className={`variant-info ${
                      colorSeleccionado === variant ? "selected" : ""
                    }`}
                  >
                    <div
                      className="variant-color"
                      onClick={() => handleColorClick(variant)}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: variant.color,
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Mostrar tallas ordenadas */}
            {colorSeleccionado && tallasOrdenadas.length > 0 && (
              <div className="talla-info">
                {tallasOrdenadas.map((talla, index) => (
                  <div
                    key={index}
                    className={`talla-info ${
                      seleccionFinal.talla === talla.talla ? "selected" : ""
                    }`}
                    onClick={() => handleTallaClick(talla)}
                  >
                    <p>{talla.talla}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
