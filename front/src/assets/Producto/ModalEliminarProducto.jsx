import React, { useState } from "react";
import { eliminarProducto } from "./peticionesProducto";

export default function ModalEliminarProducto({
  hadleModalEliminarProducto,
  setHadleModalEliminarProducto,
  id,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true); // Desactiva el botón
    try {
      await eliminarProducto(id); // Realiza la acción de eliminación
      //   setHadleModalEliminarProducto(false); // Cierra el modal si la eliminación fue exitosa
    } catch (error) {
      console.error("Error eliminando productos:", error);
    } finally {
      setIsDeleting(false); // Reactiva el botón en caso de error o finalización
    }
  };

  return (
    <>
      <div
        className={`background ${hadleModalEliminarProducto ? "active" : ""}`}
        onClick={() => setHadleModalEliminarProducto(false)}
      ></div>
      <div
        className={`ModalDeletePoductos ${
          hadleModalEliminarProducto ? "active" : ""
        }`}
      >
        <h1>¿Estás seguro?</h1>
        <div className="btns-modal-delete">
          <button
            className="btn"
            onClick={() => setHadleModalEliminarProducto(false)}
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
