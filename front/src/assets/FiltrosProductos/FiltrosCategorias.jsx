import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./styles/filtros.css"; // Asegúrate de tener los estilos necesarios

function valuetext(value) {
  return `${value}€`;
}

export default function FiltrosCategorias({
  productosFiltrados,
  setProductosFiltrados,
  orden,
  setOrden,
}) {
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [productosOriginales, setProductosOriginales] =
    useState(productosFiltrados);

  useEffect(() => {
    // Extraer categorías únicas de todos los productos para mantener la lista completa
    const categoriasUnicas = Array.from(
      new Set(
        productosOriginales.flatMap((producto) => producto.categorias || [])
      )
    );
    setCategorias(categoriasUnicas);
  }, [productosOriginales]);

  const handleCategoriaChange = (categoria) => {
    setCategoriasSeleccionadas((prevSeleccion) => {
      const seleccionActualizada = prevSeleccion.includes(categoria)
        ? prevSeleccion.filter((c) => c !== categoria)
        : [...prevSeleccion, categoria];

      // Filtrar productos por las categorías seleccionadas
      const productosFiltradosPorCategoria = productosOriginales.filter(
        (producto) =>
          seleccionActualizada.length === 0 ||
          producto.categorias.some((c) => seleccionActualizada.includes(c))
      );

      setProductosFiltrados(productosFiltradosPorCategoria);
      return seleccionActualizada;
    });
  };

  return (
    <div className="filtros-container">
      <Box className="filtros-categorias">
        <h3>Categorías</h3>
        <div>
          {categorias.map((categoria) => (
            <FormControlLabel
              key={categoria}
              control={
                <Checkbox
                  checked={categoriasSeleccionadas.includes(categoria)}
                  onChange={() => handleCategoriaChange(categoria)}
                />
              }
              label={categoria}
            />
          ))}
        </div>
      </Box>
      {/* Puedes agregar más filtros aquí */}
    </div>
  );
}
