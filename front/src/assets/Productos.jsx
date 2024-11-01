import React, { useState, useEffect } from "react";
import { URL } from "../App";
import "./styles/productos.css";
import {
  calcularPrecioConEnvio,
  formatearPrecio,
} from "../peticiones/findProductos";
import MostrarCuotas from "./Producto/MostrarCuotas";
import Buscador from "./FiltrosProductos/Buscador";
import FiltroAdicional from "./FiltrosProductos/FiltroAdicional";
import FiltrosCategorias from "./FiltrosProductos/FiltrosCategorias";
import FiltrosTallesColores from "./FiltrosProductos/FiltrosTallesColores";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";

export const calcularDescuento = (precio, precioViejo) => {
  if (precioViejo <= 0 || precio <= 0 || precio >= precioViejo) {
    return 0; // Asegura que no se calculen valores negativos o inválidos
  }
  const diferencia = precioViejo - precio;
  const porcentajeDescuento = (diferencia / precioViejo) * 100;

  // Si el descuento es menor o igual a 5%, no se muestra
  if (porcentajeDescuento < 5) {
    return 0; // O devolver un mensaje que indique que no hay descuento significativo
  }

  return Math.round(porcentajeDescuento); // Redondea al número entero más cercano
};

export default function Productos({ productos }) {
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [orden, setOrden] = useState("default");
  const [soloEnOferta, setSoloEnOferta] = useState(false);
  const [precioMinimo, setPrecioMinimo] = useState(0);
  const [precioMaximo, setPrecioMaximo] = useState(0);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    aplicarFiltrosYOrden();
  }, [
    productos,
    orden,
    soloEnOferta,
    textoBusqueda,
    tallasSeleccionadas,
    coloresSeleccionados,
    priceRange, // Añadido para actualizar el filtro de precios
  ]);

  useEffect(() => {
    if (productos.length > 0) {
      const precios = productos.map((producto) => producto.precio);
      const min = Math.min(...precios);
      const max = Math.max(...precios);

      setPrecioMinimo(min);
      setPrecioMaximo(max);
      setPriceRange([min, max]);
    }
  }, [productos]);

  const filtrarProductos = (texto) => {
    setTextoBusqueda(texto);
  };

  const aplicarFiltrosYOrden = () => {
    let productosFiltradosAplicados = productos;

    // Filtrar por oferta si está activo
    if (soloEnOferta) {
      productosFiltradosAplicados = productosFiltradosAplicados.filter(
        (producto) => producto.sale === true
      );
    }

    // Filtrar por búsqueda de texto
    if (textoBusqueda) {
      productosFiltradosAplicados = productosFiltradosAplicados.filter(
        (producto) => {
          const titulo = producto.titulo ? producto.titulo.toLowerCase() : "";
          const descripcion = producto.descripcion
            ? producto.descripcion.toLowerCase()
            : "";
          const tags = producto.tags
            ? producto.tags.map((tag) => tag.toLowerCase())
            : [];

          return (
            titulo.includes(textoBusqueda.toLowerCase()) ||
            descripcion.includes(textoBusqueda.toLowerCase()) ||
            tags.some((tag) => tag.includes(textoBusqueda.toLowerCase()))
          );
        }
      );
    }

    // Filtrar por colores
    if (coloresSeleccionados.length > 0) {
      productosFiltradosAplicados = productosFiltradosAplicados.filter(
        (producto) =>
          producto.variantes?.some((variante) =>
            coloresSeleccionados.includes(variante.color)
          )
      );
    }

    // Filtrar por tallas
    if (tallasSeleccionadas.length > 0) {
      productosFiltradosAplicados = productosFiltradosAplicados.filter(
        (producto) =>
          producto.variantes?.some((variante) =>
            variante.tallas?.some((talla) =>
              tallasSeleccionadas.includes(talla.talla)
            )
          )
      );
    }

    // Filtrar por rango de precios
    productosFiltradosAplicados = productosFiltradosAplicados.filter(
      (producto) =>
        producto.precio >= priceRange[0] && producto.precio <= priceRange[1]
    );

    // Aplicar orden
    productosFiltradosAplicados = ordenarProductos(productosFiltradosAplicados);

    setProductosFiltrados(productosFiltradosAplicados);
  };

  const ordenarProductos = (productos) => {
    let productosOrdenados = [...productos];

    if (orden === "popularidad") {
      productosOrdenados.sort((a, b) => {
        if (a.cantidadVendido === 0 && b.cantidadVendido > 0) return 1;
        if (a.cantidadVendido > 0 && b.cantidadVendido === 0) return -1;
        return b.cantidadVendido - a.cantidadVendido;
      });
    } else if (orden === "fecha") {
      productosOrdenados.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (orden === "precio-bajo") {
      productosOrdenados.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precio-alto") {
      productosOrdenados.sort((a, b) => b.precio - a.precio);
    } else if (orden === "default") {
      productosOrdenados = productos;
    }

    return productosOrdenados;
  };

  function valuetext(value) {
    return `${value}€`;
  }

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <div className="container-productos">
      <h1>Productos</h1>
      <div
        className="filtros-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Buscador onBuscar={filtrarProductos} />

        <FiltroAdicional
          productosFiltrados={productosFiltrados}
          setProductosFiltrados={setProductosFiltrados}
          orden={orden}
          setOrden={setOrden}
        />
      </div>

      <div className="container-filtros-productos">
        <div>
          <Box sx={{ marginTop: 2 }}>
            <button className="btn" onClick={() => window.location.reload()}>
              Restablecer Filtros
            </button>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={soloEnOferta}
                  onChange={() => setSoloEnOferta((prev) => !prev)}
                />
              }
              label="Solo en oferta"
            />
          </Box>

          <div className="filtro-precios">
            <h2>Filtrar por Precio</h2>
            <Box sx={{ width: 500 }}>
              <Slider
                getAriaLabel={() => "Rango de precios"}
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={precioMinimo}
                max={precioMaximo}
              />
            </Box>
            <p>
              de ${formatearPrecio(priceRange[0])} hasta $
              {formatearPrecio(priceRange[1])}
            </p>
          </div>
          <br />
          <FiltrosCategorias
            productosFiltrados={productosFiltrados}
            setProductosFiltrados={setProductosFiltrados}
            orden={orden}
            setOrden={setOrden}
          />
          <FiltrosTallesColores
            productosFiltrados={productosFiltrados}
            setProductosFiltrados={setProductosFiltrados}
            orden={orden}
            setOrden={setOrden}
            tallasSeleccionadas={tallasSeleccionadas}
            setTallasSeleccionadas={setTallasSeleccionadas}
            coloresSeleccionados={coloresSeleccionados}
            setColoresSeleccionados={setColoresSeleccionados}
          />
        </div>
        {productosFiltrados && productosFiltrados.length !== 0 ? (
          <div className="productos-lista">
            {productosFiltrados.map((producto, index) => (
              <a
                key={index}
                href={`/producto/${producto._id}`}
                style={{ color: "black",textDecoration:"none" }}
              >
                <div className="productos-item">
                  <div className="image-container">
                    <img
                      style={{ maxHeight: "350px" }}
                      src={`${URL}${producto.imagenPortada}`}
                      alt={producto.titulo}
                    />

                    {producto.sale && (
                      <p className="image-container-sale">SALE</p>
                    )}
                    {producto.precioViejo != 0 &&
                      calcularDescuento(
                        producto.precio,
                        producto.precioViejo
                      ) != 0 && (
                        <p className="image-container-off">
                          {calcularDescuento(
                            producto.precio,
                            producto.precioViejo
                          )}
                          % OFF
                        </p>
                      )}
                  </div>
                  <p
                    className={`estado ${
                      producto.estado === "agotado" ? "agotado" : ""
                    }`}
                  >
                    {producto.estado}
                  </p>
                  <h2>{producto.titulo}</h2>
                  <p>
                    {producto.precioViejo !== 0 && (
                      <s>${formatearPrecio(producto.precioViejo)} </s>
                    )}{" "}
                    <span> ${formatearPrecio(producto.precio)}</span>
                  </p>
                  <MostrarCuotas
                    precio={producto.precio}
                    cuotas={producto.cuotas}
                  />
                  {producto.porcentajeEnvio === 0 && (
                    <p>
                      <strong>Sin Costo de Envio</strong>
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="productos-lista-noproducts">
            <p>No hay Productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
