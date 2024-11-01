import React, { useState } from "react";
import { eliminarProductos } from "../peticiones/eliminarProductos";
import "./styles/ModalDeleteProductos.css";

export default function ModalDeleteProductos({
  hadleModalDeleteProductos,
  setHadleModalDeleteProductos,
  setProductos,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true); // Desactiva el botón
    try {
      await eliminarProductos(setProductos); // Realiza la acción de eliminación
      setHadleModalDeleteProductos(false);
    } catch (error) {
      console.error("Error eliminando productos:", error);
    } finally {
      setIsDeleting(false); // Reactiva el botón en caso de error o finalización
    }
  };

  return (
    <>
      <div
        className={`background ${hadleModalDeleteProductos ? "active" : ""}`}
        onClick={() => setHadleModalDeleteProductos(false)}
      ></div>
      <div
        className={`ModalDeletePoductos ${
          hadleModalDeleteProductos ? "active" : ""
        }`}
      >
        <h1>¿Estás seguro?</h1>
        <div className="btns-modal-delete">
          <button
            className="btn"
            onClick={() => setHadleModalDeleteProductos(false)}
          >
            NO
          </button>
          <button
            className="btn"
            onClick={handleDelete}
            disabled={isDeleting} // Desactiva el botón cuando isDeleting es true
          >
            {isDeleting ? "Eliminando..." : "SI"}
          </button>
        </div>
      </div>
    </>
  );
}
