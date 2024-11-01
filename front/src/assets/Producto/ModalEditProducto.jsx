import React, { useState, useEffect } from "react";
import { notifyEsperando } from "../../alerts/Alerts";
import { handleEditProducto } from "./peticionesProducto";
import InputTextModalEditProductos from "./ComponentesModalEditProductos/InputTextModalEditProductos";
import InputNumberModalEditProducto from "./ComponentesModalEditProductos/InputNumberModalEditProducto";
import EstadoProductoModalEdit from "./ComponentesModalEditProductos/EstadoProductoModalEdit";
import PorStockModalEditProducto from "./ComponentesModalEditProductos/PorStockModalEditProducto";
import PorCuotasEditModalProductos from "./ComponentesModalEditProductos/PorCuotasEditModalProductos";
import VariantesModalEditProductos from "./ComponentesModalEditProductos/VariantesModalEditProductos";
import PortadaModalEditProducto from "./ComponentesModalEditProductos/PortadaModalEditProducto";
import { validateFormEditModal } from "./ComponentesModalEditProductos/FuncionesModalEditProductos";
import { shouldShowCantidadStock } from "../../peticiones/funcionesModal";
import { calcularPrecioConEnvio } from "../../peticiones/findProductos";

export default function ModalEditProducto({
  hadleModalEditProducto,
  setHadleModalEditProducto,
  producto,
}) {
  const [descripcion, setDescripcion] = useState("");
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState(1000);
  const [precioViejo, setPrecioViejo] = useState(0);
  const [sale, setSale] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [porStock, setPorStock] = useState(false);
  const [cantidadStock, setCantidadStock] = useState(1);
  const [estado, setEstado] = useState("disponible");
  const [cuotas, setCuotas] = useState(null);
  const [imagenPortada, setImagenPortada] = useState(null);
  const [imagenPreviewPortada, setImagenPreviewPortada] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [imagenesData, setImagenesData] = useState([]);
  const [tallesAgregados, setTallesAgregados] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado
  const [porcentajeEnvio, setPorcentajeEnvio] = useState(0);

  const [initialData, setInitialData] = useState({
    titulo: "",
    descripcion: "",
    precio: 1000,
    precioViejo: 0,
    sale: false,
    categoria: "",
    porStock: false,
    cantidadStock: 1,
    estado: "disponible",
    porcentajeEnvio: 0,
  });

  useEffect(() => {
    if (producto) {
      setTitulo(producto.titulo || "");
      setDescripcion(producto.descripcion || "");
      setPrecio(producto.precio || 1000);
      setPrecioViejo(producto.precioViejo || 0);
      setImagenPortada(producto.imagenPortada || {});
      setSale(producto.sale || false);
      setCategoria(producto.categorias ? producto.categorias.join(", ") : ""); // Convertir lista a cadena
      setPorStock(producto.cantidadStock.porStock ? true : false);
      setCantidadStock(
        producto.cantidadStock.cant > 0 ? producto.cantidadStock.cant : 1
      );
      setEstado(producto.estado || "disponible");
      setCuotas(producto.cuotas || []);
      setImagenesData(producto.variantes || []);
      setPorcentajeEnvio(producto.porcentajeEnvio || 0);

      setInitialData({
        titulo: producto.titulo || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio || 1000,
        precioViejo: producto.precioViejo || 0,
        sale: producto.sale || false,
        imagenPortada: producto.imagenPortada || {},
        categoria: producto.categorias || [], // Mantenerlo como lista
        porStock: producto.cantidadStock.porStock || false,
        cantidadStock:
          producto.cantidadStock.cant > 0 ? producto.cantidadStock.cant : 0,
        estado: producto.estado || "disponible",
        imagenesData: producto.variantes || [],
        cuotas: producto.cuotas || [],
        porcentajeEnvio: producto.porcentajeEnvio || 0,
      });
    }
  }, [producto]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormEditModal(imagenPortada, imagenesData)) return;

    setIsSubmitting(true); // Desactivar el botón

    const data = {
      id: producto._id,
      titulo,
      descripcion,
      precio,
      precioViejo,
      sale,
      porcentajeEnvio,
      imagenPortada: !imagenPortada ? producto.imagenPortada : imagenPortada,
      categorias: categoria,
      porStock,
      cantidadStock,
      estado,
      cuotas,
      variantes: imagenesData,
    };

    try {
      await handleEditProducto(data, setHadleModalEditProducto);
      // Limpiar formulario y estado
      // setDescripcion("");
      // setTitulo("");
      // setPrecio(1000);
      // setPrecioViejo(0);
      // setSale(false);
      // setCategoria("");
      // setPorStock(false);
      // setCantidadStock(1);
      // setEstado("disponible");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // Reactivar el botón
    }
  };

  const handleCantidadStockChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setCantidadStock(value);
    } else {
      setCantidadStock(0);
      notifyEsperando("La cantidad en stock no puede ser menor que 0.");
    }
  };

  const handlePorStockChange = (e) => {
    const checked = e.target.checked;
    setPorStock(checked);
    if (!checked) {
      setCantidadStock(0); // Reset quantity if checkbox is unchecked
    }
  };

  return (
    <>
      <div
        className={`background ${hadleModalEditProducto ? "active" : ""}`}
        onClick={() => setHadleModalEditProducto(false)}
      ></div>
      <div
        className={`ModalAddNewProducto ${
          hadleModalEditProducto ? "active" : ""
        }`}
      >
        <div className="Modal-add-producto">
          <h1>Editar Producto</h1>
          <form onSubmit={handleSubmit}>
            <InputTextModalEditProductos
              htmlfor="titulo"
              text="Titulo*"
              type="text"
              id="titulo"
              value={titulo}
              setFunction={setTitulo}
            />
            <InputTextModalEditProductos
              htmlfor="Descripción"
              text="Descripción*"
              type="text"
              id="Descripción"
              value={descripcion}
              setFunction={setDescripcion}
              textarea={true}
            />
            <InputNumberModalEditProducto
              htmlfor="Precio"
              text="Precio* (sin puntos ni comas)*"
              type="number"
              id="Precio"
              value={precio}
              setFunction={setPrecio}
              requiredState={true}
              span="$"
            />
            <InputNumberModalEditProducto
              htmlfor="Precioviejo"
              text="Precio Viejo/Tachado (Dejar en 0 si no requiere)"
              type="number"
              id="Precioviejo"
              value={precioViejo}
              setFunction={setPrecioViejo}
              requiredState={false}
              span="$"
            />{" "}
            <InputNumberModalEditProducto
              htmlfor="porcentajeEnvio"
              label={`Porcentaje de cobro por Envío de Producto *se suma al precio* (Dejar en 0 si no requiere)`}
              text={`Porcentaje de cobro por Envío de Producto *se suma al precio* (Dejar en 0 si no requiere)`}
              type="number"
              id="porcentajeEnvio"
              value={porcentajeEnvio}
              setFunction={setPorcentajeEnvio}
              span="%"
            />
            {porcentajeEnvio != 0 ? (
              <div>
                <p>
                  <strong>
                    Precio Total con envío: $
                    {
                      calcularPrecioConEnvio(precio, porcentajeEnvio)
                        .precioTotalConEnvio
                    }
                  </strong>
                </p>
                <p>
                  <strong>
                    Cobro adicional por envío: $
                    {
                      calcularPrecioConEnvio(precio, porcentajeEnvio)
                        .cobroAdicional
                    }
                  </strong>
                </p>
              </div>
            ) : (
              <p>
                <strong>Sin Costo de Envio</strong>
              </p>
            )}
            {producto && (
              <PorCuotasEditModalProductos
                cuotasProd={producto.cuotas}
                setCuotas={setCuotas}
              />
            )}
            <InputTextModalEditProductos
              htmlfor="Categoría"
              text={`Categorías* (para agregar varias separar por una ",").*`}
              type="text"
              id="Categoría"
              value={categoria}
              setFunction={setCategoria}
            />
            <div>
              <EstadoProductoModalEdit
                estado={estado}
                setEstado={setEstado}
                sale={sale}
                setSale={setSale}
              />
              {producto && (
                <>
                  <PortadaModalEditProducto
                    producto={producto.imagenPortada}
                    setImagenPortada={setImagenPortada}
                    imagenPortada={imagenPortada}
                  />
                  <VariantesModalEditProductos
                    setImagenesPreview={setImagenesPreview}
                    setImagenes={setImagenes}
                    imagenesPreview={imagenesPreview}
                    imagenesData={imagenesData}
                    setImagenesData={setImagenesData}
                    porStock={porStock}
                    setPorStock={setPorStock}
                    setTallesAgregados={setTallesAgregados}
                  />
                </>
              )}
              {shouldShowCantidadStock(imagenesData) && (
                <PorStockModalEditProducto
                  porStock={porStock}
                  handlePorStockChange={handlePorStockChange}
                  handleCantidadStockChange={handleCantidadStockChange}
                  cantidadStock={cantidadStock}
                />
              )}
            </div>
            <button type="submit" className="btn">
              Editar Producto
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
