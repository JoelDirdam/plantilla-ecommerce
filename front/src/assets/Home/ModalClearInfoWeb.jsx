import React, { useState } from "react";
import { eliminarProductos } from "../../peticiones/eliminarProductos";
import "../styles/ModalDeleteProductos.css";
import { clearInfoWeb } from "./funcionesModalEditInfoWeb";

export default function ModalClearInfoWeb({
  hadleModalClearInfoWeb,
  setHadleModalClearInfoWeb,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true); // Desactiva el botón
    try {
      await clearInfoWeb(); // Realiza la acción de eliminación
      // setHadleModalClearInfoWeb(false);
    } catch (error) {
      console.error("Error eliminando productos:", error);
    } finally {
      setIsDeleting(false); // Reactiva el botón en caso de error o finalización
    }
  };

  return (
    <>
      <div
        className={`background clear-info-web ${
          hadleModalClearInfoWeb ? "active" : ""
        }`}
        onClick={() => setHadleModalClearInfoWeb(false)}
      ></div>
      <div
        className={`ModalDeletePoductos clear-info-web ${
          hadleModalClearInfoWeb ? "active" : ""
        }`}
      >
        <h1>¿Estás seguro?</h1>
        <div className="btns-modal-delete">
          <button
            className="btn"
            onClick={() => setHadleModalClearInfoWeb(false)}
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
