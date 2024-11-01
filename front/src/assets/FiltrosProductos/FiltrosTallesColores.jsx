import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./styles/filtros.css"; // Asegúrate de tener los estilos necesarios

export default function FiltrosTallesColores({
  productosFiltrados,
  setProductosFiltrados,
  orden,
  setOrden,
}) {
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState([]);
  const [productosOriginales, setProductosOriginales] =
    useState(productosFiltrados);

  useEffect(() => {
    // Extraer colores únicos, excluyendo null o vacío
    const coloresUnicos = Array.from(
      new Set(
        productosOriginales.flatMap(
          (producto) =>
            producto.variantes?.flatMap((variante) =>
              variante.color &&
              variante.color.trim() !== "" &&
              variante.color != "null"
                ? [variante.color]
                : []
            ) || []
        )
      )
    );
    setColores(coloresUnicos);

    // Extraer tallas únicas, excluyendo null o vacío
    const tallasUnicas = Array.from(
      new Set(
        productosOriginales.flatMap(
          (producto) =>
            producto.variantes?.flatMap(
              (variante) =>
                variante.tallas?.flatMap((talla) =>
                  talla.talla && talla.talla.trim() !== "" ? [talla.talla] : []
                ) || []
            ) || []
        )
      )
    );
    setTallas(tallasUnicas);
  }, [productosOriginales]);

  const handleColorChange = (color) => {
    setColoresSeleccionados((prevSeleccion) => {
      const seleccionActualizada = prevSeleccion.includes(color)
        ? prevSeleccion.filter((c) => c !== color)
        : [...prevSeleccion, color];

      // Filtrar productos por colores
      const productosFiltradosPorColor = productosOriginales.filter(
        (producto) =>
          seleccionActualizada.length === 0 ||
          producto.variantes?.some((variante) =>
            seleccionActualizada.includes(variante.color)
          )
      );

      setProductosFiltrados(productosFiltradosPorColor);
      return seleccionActualizada;
    });
  };

  const handleTallaChange = (talla) => {
    setTallasSeleccionadas((prevSeleccion) => {
      const seleccionActualizada = prevSeleccion.includes(talla)
        ? prevSeleccion.filter((t) => t !== talla)
        : [...prevSeleccion, talla];

      // Filtrar productos por tallas
      const productosFiltradosPorTalla = productosOriginales.filter(
        (producto) =>
          seleccionActualizada.length === 0 ||
          producto.variantes?.some((variante) =>
            variante.tallas.some((t) => seleccionActualizada.includes(t.talla))
          )
      );

      setProductosFiltrados(productosFiltradosPorTalla);
      return seleccionActualizada;
    });
  };

  return (
    <>
      <div className="filtros-container">
        <Box className="filtros-categorias">
          <h3>Colores</h3>
          <div className="filtros-color-tallas">
            {colores.map((color) => (
              <FormControlLabel
                key={color}
                control={
                  <Checkbox
                    checked={coloresSeleccionados.includes(color)}
                    onChange={() => handleColorChange(color)}
                  />
                }
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: color,
                        borderRadius: "15%",
                        display: "inline-block",
                        // marginRight: "5px",
                        border: "2px solid black", // Añadir borde para colores muy claros
                      }}
                    ></span>
                    {/* {color} */}
                  </div>
                }
              />
            ))}
          </div>
        </Box>
      </div>
      <Box className="filtros-categorias">
        <h3>Talles</h3>
        <div className="filtros-color-tallas">
          {tallas.map((talla) => (
            <FormControlLabel
              key={talla}
              control={
                <Checkbox
                  checked={tallasSeleccionadas.includes(talla)}
                  onChange={() => handleTallaChange(talla)}
                />
              }
              label={talla}
            />
          ))}
        </div>
      </Box>

      {/* Puedes agregar más filtros aquí */}
    </>
  );
}
