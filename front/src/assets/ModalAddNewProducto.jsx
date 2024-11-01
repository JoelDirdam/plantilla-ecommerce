import React, { useState } from "react";
import "./styles/ModalAddNewProducto.css";
import {
  notifyErroneo,
  notifyEsperando,
  notifyExitoso,
} from "../alerts/Alerts";
import axios from "axios";
import { handleAddProducto } from "../peticiones/NewProducto";
import InputsFormNumber from "./FormComponents/InputsFormNumber";
import InputsFormText from "./FormComponents/InputsFormText";
import EstadoProducto from "./FormComponents/EstadoProducto";
import InputOferta from "./FormComponents/InputOferta";
import ImagenPortada from "./FormComponents/ImagenPortada";
import ImagenesProductos from "./FormComponents/ImagenesProductos";
import CantidadStock from "./FormComponents/CantidadStock";
import {
  shouldShowCantidadStock,
  validateForm,
} from "../peticiones/funcionesModal";
import EnCuotas from "./FormComponents/EnCuotas";
import { calcularPrecioConEnvio } from "../peticiones/findProductos";

export default function ModalAddNewProducto({
  activeModalAddProducts,
  setActiveModalAddProducts,
  setProductos,
}) {
  const [imagenPortada, setImagenPortada] = useState(null);
  const [imagenPreviewPortada, setImagenPreviewPortada] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [imagenesData, setImagenesData] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState(1000);
  const [precioViejo, setPrecioViejo] = useState(0);
  const [sale, setSale] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [porStock, setPorStock] = useState(false);
  const [cantidadStock, setCantidadStock] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variantes, setVariantes] = useState();
  const [tallesAgregados, setTallesAgregados] = useState(null);
  const [cuotas, setCuotas] = useState(null);
  const [porcentajeEnvio, setPorcentajeEnvio] = useState(0);
  // Estado para manejar el estado de la palomita
  const [estado, setEstado] = useState("disponible");
  // Nueva validación para tallas y stock

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !validateForm(
        imagenPortada,
        variantes,
        imagenes,
        precio,
        precioViejo,
        porStock,
        cantidadStock,
        tallesAgregados,
        porcentajeEnvio
      )
    ) {
      return;
    }

    if (porStock && cantidadStock < 1) {
      return;
    }
    // Evitar múltiples envíos, desactivando el botón
    setIsSubmitting(true);
    const data = {
      titulo,
      descripcion,
      precio,
      precioViejo,
      sale,
      categoria,
      porStock,
      imagenPortada,
      variantes,
      cantidadStock,
      estado,
      tallesAgregados,
      cuotas,
      porcentajeEnvio,
    };

    try {
      await handleAddProducto(data, setProductos);
      setDescripcion("");
      setTitulo("");
      setPrecio(1000);
      setPrecioViejo(0);
      setSale(false);
      setCategoria("");
      setImagenPortada(null);
      setImagenPreviewPortada(null);
      setImagenes([]);
      setImagenesPreview([]);
      setPorStock(false);
      setCantidadStock(1);
      setEstado("disponible");
      setActiveModalAddProducts(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // Reactivar el botón después de la respuesta
    }
  };

  return (
    <>
      <div
        className={`background ${activeModalAddProducts ? "active" : ""}`}
        onClick={() => setActiveModalAddProducts(false)}
      ></div>
      <div
        className={`ModalAddNewProducto ${
          activeModalAddProducts ? "active" : ""
        }`}
      >
        <div className="Modal-add-producto">
          <h1>Agregar Nuevo Producto</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <InputsFormText
              htmlfor="titulo"
              label="Titulo*"
              type="text"
              id="titulo"
              value={titulo}
              setText={setTitulo}
              textarea={false}
            />
            <InputsFormText
              htmlfor="Descripción"
              label="Descripción*"
              type="text"
              id="Descripción"
              value={descripcion}
              setText={setDescripcion}
              textarea={true}
            />
            <InputsFormNumber
              htmlfor="Precio"
              label="Precio* (sin puntos ni comas)"
              type="number"
              id="Precio"
              value={precio}
              required={true}
              setNumber={setPrecio}
              span="$"
            />
            <InputsFormNumber
              htmlfor="Precioviejo"
              label={`Precio Viejo/Tachado "% OFF" (Dejar en 0 si no requiere)`}
              type="number"
              id="Precioviejo"
              value={precioViejo}
              required={false}
              setNumber={setPrecioViejo}
              span="$"
            />
            <InputsFormNumber
              htmlfor="porcentajeEnvio"
              label={`Porcentaje de cobro por Envío de Producto *se suma al precio* (Dejar en 0 si no requiere)`}
              type="number"
              id="porcentajeEnvio"
              value={porcentajeEnvio}
              required={false}
              setNumber={setPorcentajeEnvio}
              span="%"
            />
            {porcentajeEnvio != 0 ? (
              <div>
                <p>
                  <strong>Precio Total con envío: </strong>$
                  {
                    calcularPrecioConEnvio(precio, porcentajeEnvio)
                      .precioTotalConEnvio
                  }
                </p>
                <p>
                  <strong>Cobro adicional por envío: </strong>$
                  {
                    calcularPrecioConEnvio(precio, porcentajeEnvio)
                      .cobroAdicional
                  }
                </p>
              </div>
            ) : (
              <p>
                <strong>Sin Costo de Envio</strong>
              </p>
            )}

            <EnCuotas setCuotas={setCuotas} />
            <InputsFormText
              htmlfor="Categoría"
              label={`Categorías* (para agregar varias separar por una ",").*`}
              type="text"
              id="Categoría"
              value={categoria}
              setText={setCategoria}
              textarea={false}
            />
            <InputOferta setSale={setSale} sale={sale} />
            {/* Nueva sección para seleccionar el estado de las palomitas */}
            <EstadoProducto estado={estado} setEstado={setEstado} />
            <ImagenPortada
              imagenPreviewPortada={imagenPreviewPortada}
              setImagenPortada={setImagenPortada}
              setImagenPreviewPortada={setImagenPreviewPortada}
            />
            <ImagenesProductos
              setImagenesPreview={setImagenesPreview}
              setImagenes={setImagenes}
              imagenesPreview={imagenesPreview}
              imagenesData={imagenesData}
              setImagenesData={setImagenesData}
              setVariantes={setVariantes}
              porStock={porStock}
              setPorStock={setPorStock}
              setTallesAgregados={setTallesAgregados}
            />
            {shouldShowCantidadStock(tallesAgregados) && (
              <CantidadStock
                porStock={porStock}
                setPorStock={setPorStock}
                cantidadStock={cantidadStock}
                setCantidadStock={setCantidadStock}
              />
            )}
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Agregar Producto"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
