import React, { useState } from "react";
import Productos from "./Productos";
import ModalAddNewProducto from "./ModalAddNewProducto";
import ModalDeleteProductos from "./ModalDeleteProductos";

export default function ProductosLista({ productos, setProductos }) {
  const [activeModalAddProducts, setActiveModalAddProducts] = useState(false);
  const [hadleModalDeleteProductos, setHadleModalDeleteProductos] =
    useState(false);

  return (
    <>
      <ModalAddNewProducto
        activeModalAddProducts={activeModalAddProducts}
        setActiveModalAddProducts={setActiveModalAddProducts}
        setProductos={setProductos}
      />
      <ModalDeleteProductos
        hadleModalDeleteProductos={hadleModalDeleteProductos}
        setHadleModalDeleteProductos={setHadleModalDeleteProductos}
        setProductos={setProductos}
      />
      <div className="container-btns">
        {productos && productos.length != 0 && (
          <button
            className="btn"
            onClick={() => setHadleModalDeleteProductos(true)}
          >
            Eliminar Productos
          </button>
        )}

        <button className="btn" onClick={() => setActiveModalAddProducts(true)}>
          Agregar Producto
        </button>
      </div>
      <br />
      <hr />

      <Productos productos={productos} setProductos={setProductos} />
    </>
  );
}
