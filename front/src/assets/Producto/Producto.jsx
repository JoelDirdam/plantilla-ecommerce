import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Producto.css";
import { URL } from "../../App";
import { formatearPrecio } from "../../peticiones/findProductos";
import ModalEliminarProducto from "./ModalEliminarProducto";
import ModalEditProducto from "./ModalEditProducto";
import { notifyExitoso } from "../../alerts/Alerts";
import ProductoInfo from "./ProductoInfo";
import ImagenesProducto from "./ImagenesProducto";
import Spinner from "../../Spinner";

export default function Producto({ productos }) {
  const { id } = useParams();
  const [productoSelected, setProductoSelected] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState(""); // Estado para la miniatura seleccionada
  const [hadleModalEliminarProducto, setHadleModalEliminarProducto] =
    useState(false);
  const [hadleModalEditProducto, setHadleModalEditProducto] = useState(false);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);

  // Función para copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        notifyExitoso("Código de Producto copiado");
        setTimeout(() => setCopied(false), 2000); // Opcional: resetear el estado después de 2 segundos
      })
      .catch(() => {
        console.error("Error copying to clipboard");
      });
  };

  useEffect(() => {
    if (productos) {
      const producto = productos.find((prod) => prod._id === id);
      if (producto) {
        setProductoSelected(producto);
        setImagenPrincipal(producto.imagenPortada);
        setImagenSeleccionada(producto.imagenPortada);
        setLoading(false); // Desactivar el loading cuando el producto se cargue
      } else {
        window.location.href = "/";
      }
    }
  }, [id, productos]);

  const manejarMiniaturaClick = (imagen) => {
    setImagenPrincipal(imagen);
    setImagenSeleccionada(imagen);
  };

  return (
    <div className={`producto-container ${!loading ? "loaded" : ""}`}>
      {loading ? (
        <div className="spinner-container">
          {/* Puedes usar tu componente Spinner aquí */}
          <Spinner />
        </div>
      ) : (
        <>
          <button
            onClick={() => (window.location.href = "/productos")}
            className="btn"
          >
            Volver
          </button>
          <ModalEliminarProducto
            hadleModalEliminarProducto={hadleModalEliminarProducto}
            setHadleModalEliminarProducto={setHadleModalEliminarProducto}
            id={id}
          />
          <ModalEditProducto
            hadleModalEditProducto={hadleModalEditProducto}
            setHadleModalEditProducto={setHadleModalEditProducto}
            id={id}
            producto={productoSelected}
          />
          {productoSelected && (
            <div className="producto-detalle">
              {/* Sección de miniaturas */}
              <ImagenesProducto
                productoSelected={productoSelected}
                manejarMiniaturaClick={manejarMiniaturaClick}
                imagenSeleccionada={imagenSeleccionada}
                imagenPrincipal={imagenPrincipal}
              />

              {/* Información del producto */}
              <ProductoInfo
                productoSelected={productoSelected}
                setHadleModalEditProducto={setHadleModalEditProducto}
                copyToClipboard={copyToClipboard}
                setHadleModalEliminarProducto={setHadleModalEliminarProducto}
                onColorClick={manejarMiniaturaClick}
                onTallaClick={manejarMiniaturaClick}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
