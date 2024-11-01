import axios from "axios";
import { URL } from "../App";

export const orderPedidos = async (setPedidos) => {
  const token = JSON.parse(localStorage.getItem("TokenLogin"));

  if (!token) {
    console.error("Token no encontrado");
    return;
  }

  try {
    const response = await axios.get(`${URL}/order-pedidos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      setPedidos(response.data); // Ajusta esto según la estructura de la respuesta
    } else if (response.status === 205) {
      localStorage.removeItem("TokenLogin");
      window.location.href = "/";
    } else {
      setPedidos();
    }
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
  }
};
