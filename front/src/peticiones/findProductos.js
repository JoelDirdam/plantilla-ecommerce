import axios from "axios";
import { URL } from "../App";

export const orderProductos = async (setProductos) => {
  try {
    const response = await axios.get(`${URL}/order-productos`);
    if (response.status === 200) {
      setProductos(response.data.productos);
    }
  } catch (error) {
    console.log(error);
  }
};
// formateo Precio
export const formatearPrecio = (precio) => {
  if (typeof precio !== "number" || isNaN(precio)) {
    return "0"; // Retorna un valor predeterminado si el precio no es válido
  }

  // Formatear el número
  const opciones = {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  // Si el número tiene decimales distintos de 00, mostrarlos, de lo contrario, mostrar sin decimales
  return precio % 1 === 0
    ? precio.toLocaleString("es-AR", { ...opciones, minimumFractionDigits: 0 })
    : precio.toLocaleString("es-AR", opciones);
};

export const calcularPrecioConEnvio = (precio, porcentajeEnvio) => {
  // Calcula el incremento por el porcentaje de envío
  const cobroAdicional = (precio * porcentajeEnvio) / 100;

  // Suma el incremento al precio original para obtener el total
  const precioTotalConEnvio = precio + cobroAdicional;

  // Devuelve ambos valores: precio total y el incremento por el envío
  return {
    precioTotalConEnvio: formatearPrecio(precioTotalConEnvio),
    cobroAdicional: formatearPrecio(cobroAdicional),
  };
};
