import React, { useState, useEffect } from "react";
import {
  calcularPrecioConEnvio,
  formatearPrecio,
} from "../../peticiones/findProductos";
import DescripcionProducto from "./DescripcionProducto";
import MostrarCuotas from "./MostrarCuotas";
import MostrarCuotasProductoIndividual from "./MostrarCuotasProductoIndividual";

export default function ProductoInfo({
  productoSelected,
  setHadleModalEditProducto,
  copyToClipboard,
  setHadleModalEliminarProducto,
  onColorClick, // Nueva prop para manejar el clic en el color
}) {
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [seleccionFinal, setSeleccionFinal] = useState({
    color: null,
    talla: null,
    precio: null,
  });

  useEffect(() => {
    if (productoSelected.variantes && productoSelected.variantes.length > 0) {
      // Selecciona el primer color por defecto
      setColorSeleccionado(productoSelected.variantes[0]);
    }
  }, [productoSelected.variantes]);

  useEffect(() => {
    if (colorSeleccionado) {
      // No filtrar las tallas, mostrar todas
      setTallasDisponibles(colorSeleccionado.tallas);

      // Si se desea seleccionar automáticamente una talla
      if (colorSeleccionado.tallas.length > 0) {
        setTallaSeleccionada(colorSeleccionado.tallas[0]); // Primera talla
      }
    }
  }, [colorSeleccionado]);

  useEffect(() => {
    // Actualizar los datos finales seleccionados cada vez que cambie el color o la talla
    if (colorSeleccionado && tallaSeleccionada) {
      const precioFinal =
        tallaSeleccionada.precio > 0
          ? tallaSeleccionada.precio
          : productoSelected.precio;
      setSeleccionFinal({
        color: colorSeleccionado.color,
        talla: tallaSeleccionada.talla,
        precio: precioFinal,
      });
    }
  }, [colorSeleccionado, tallaSeleccionada, productoSelected.precio]);

  const handleColorClick = (variant) => {
    setColorSeleccionado(variant);
    onColorClick(variant.imagen);
  };

  const handleTallaClick = (talla) => {
    setTallaSeleccionada(talla);
  };

  const obtenerPrecio = () => {
    if (tallaSeleccionada && tallaSeleccionada.precio > 0) {
      return tallaSeleccionada.precio;
    }
    return productoSelected.precio;
  };

  return (
    <div className="producto-info">
      <h4 style={{ color: "gray", cursor: "pointer" }} title="Copiar Código">
        <strong onClick={() => copyToClipboard(productoSelected._id)}>
          {productoSelected.codigoProducto}
        </strong>
      </h4>
      <p
        className={`estado ${
          productoSelected.estado === "agotado" ? "agotado" : ""
        }`}
      >
        {productoSelected.estado}
      </p>
      <h1 className="producto-titulo">{productoSelected.titulo}</h1>

      {productoSelected.cantidadStock.porStock &&
        productoSelected.cantidadStock != 0 && (
          <p>Cantidad en Stock {productoSelected.cantidadStock.cant}</p>
        )}
      {productoSelected.porcentajeEnvio != 0 ? (
        <div>
          <p>
            <strong>
              Envío con Costo del {productoSelected.porcentajeEnvio}%
            </strong>
          </p>
          <p>
            <strong>Precio Total con envío: </strong>$
            {
              calcularPrecioConEnvio(
                productoSelected.precio,
                productoSelected.porcentajeEnvio
              ).precioTotalConEnvio
            }
          </p>
          <p>
            <strong>Cobro adicional por envío: </strong>$
            {
              calcularPrecioConEnvio(
                productoSelected.precio,
                productoSelected.porcentajeEnvio
              ).cobroAdicional
            }
          </p>
        </div>
      ) : (
        <p>
          <strong>Sin Costo de Envio</strong>
        </p>
      )}
      <DescripcionProducto
        seleccionFinal={seleccionFinal}
        productoSelected={productoSelected}
        handleColorClick={handleColorClick}
        handleTallaClick={handleTallaClick}
        colorSeleccionado={colorSeleccionado}
        tallasDisponibles={tallasDisponibles}
      />
      <MostrarCuotasProductoIndividual
        precio={
          seleccionFinal.precio
            ? seleccionFinal.precio
            : productoSelected.precio
        }
        cuotas={productoSelected.cuotas}
      />
      <p>Cantidad Vendida: {productoSelected.cantidadVendido}</p>
      <p>
        {/* Mostrar precio viejo solo si el precio de la talla seleccionada es 0 */}
        {(!tallaSeleccionada?.precio || tallaSeleccionada?.precio === 0) &&
          productoSelected.precioViejo > 0 && (
            <s>$ {formatearPrecio(productoSelected.precioViejo)}</s>
          )}{" "}
        $ {formatearPrecio(obtenerPrecio())}
      </p>
      <button className="btn" onClick={() => setHadleModalEditProducto(true)}>
        Editar Producto
      </button>
      <button
        className="btn"
        onClick={() => setHadleModalEliminarProducto(true)}
      >
        Eliminar
      </button>
      <p>
        Descripción:
        <br />
        <span
          className="producto-descripcion"
          dangerouslySetInnerHTML={{
            __html: productoSelected.descripcion.replace(/\n/g, "<br />"),
          }}
        ></span>{" "}
      </p>
    </div>
  );
}
