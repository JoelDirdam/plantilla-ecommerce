import React, { useState } from "react";
import axios from "axios";
import { URL } from "../App";
import {
  notifyErroneo,
  notifyEsperando,
  notifyExitoso,
} from "../alerts/Alerts";

export default function ModalEliminarPedido({
  modalEliminarPedido,
  setModalEliminarPedido,
  id,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true); // Desactiva el botóns
    try {
      const response = await axios.delete(`${URL}/eliminar-pedido`, {
        params: {
          id: id,
          token: JSON.parse(localStorage.getItem("TokenLogin")),
        },
      }); // Realiza la acción de eliminación
      if (response.status === 200) {
        notifyExitoso("¡Pedido Eliminado con exito!");
        window.location.href = "/pedidos";
      } else {
        notifyEsperando("¡No se pudo eliminar el pedido!");
      }
      setModalEliminarPedido(false); // Cierra el modal si la eliminación fue exitosa
    } catch (error) {
      notifyErroneo("¡Error desde el servidor!");
      console.error("Error eliminando productos:", error);
    } finally {
      setIsDeleting(false); // Reactiva el botón en caso de error o finalización
    }
  };

  return (
    <>
      <div
        className={`background modal-pedido ${
          modalEliminarPedido ? "active" : ""
        }`}
        onClick={() => setModalEliminarPedido(false)}
      ></div>
      <div
        className={`ModalDeletePoductos ${modalEliminarPedido ? "active" : ""}`}
      >
        <h1>¿Estás seguro?</h1>
        <div className="btns-modal-delete">
          <button className="btn" onClick={() => setModalEliminarPedido(false)}>
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
