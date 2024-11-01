import axios from "axios";
import { URL } from "../App";
import {
  notifyErroneo,
  notifyEsperando,
  notifyExitoso,
} from "../alerts/Alerts";
import { orderProductos } from "./findProductos";

export const eliminarProductos = async (setProductos) => {
  try {
    const response = await axios.delete(`${URL}/eliminar-productos`, {
      params: {
        token: JSON.parse(localStorage.getItem("TokenLogin")),
      },
    });
    if (response.status === 200) {
      notifyExitoso("Productos Eliminados coon Exito");
      orderProductos(setProductos);
    } else if (response.status === 205) {
      notifyEsperando("No hay Productos que eliminar");
    }
  } catch (error) {
    console.log(error);
    notifyErroneo("Error al eliminar productos");
  }
};
