import axios from "axios";
import { URL } from "../App";
import { notifyErroneo, notifyExitoso } from "../alerts/Alerts";
import { orderProductos } from "./findProductos";

export const handleAddProducto = async (data, setProductos) => {
  const {
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
  } = data;

  try {
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("precioViejo", precioViejo);
    formData.append("sale", sale);
    formData.append("categoria", categoria);
    formData.append("token", JSON.parse(localStorage.getItem("TokenLogin")));
    // Crear un objeto para cantidadStock
    const cantidadStockObj = {
      porStock,
      cant: porStock ? cantidadStock : 0,
    };
    formData.append("cantidadStock", JSON.stringify(cantidadStockObj));
    formData.append("estado", estado);
    formData.append("porcentajeEnvio", porcentajeEnvio);

    // Añadir el array de cuotas modificado
    formData.append("cuotas", JSON.stringify(cuotas));

    // Añadir la imagen de portada
    if (imagenPortada) {
      formData.append("imagenPortada", imagenPortada);
    }
    // Añadir las variantes
    variantes.forEach((variante, index) => {
      if (variante.file) {
        formData.append(`variantes[${index}][imagen]`, variante.file); // Imagen como archivo
      }
      formData.append(`variantes[${index}][color]`, variante.color);
      formData.append(`variantes[${index}][stock]`, variante.stock);
      formData.append(`variantes[${index}][talla]`, variante.talla); // Si la variante tiene una talla general

      // Añadir las tallas con sus respectivas propiedades
      if (variante.tallas && variante.tallas.length > 0) {
        variante.tallas.forEach((tallaItem, tallaIndex) => {
          formData.append(
            `variantes[${index}][tallas][${tallaIndex}][talla]`,
            tallaItem.talla
          );
          formData.append(
            `variantes[${index}][tallas][${tallaIndex}][stock]`,
            tallaItem.stock
          );
          formData.append(
            `variantes[${index}][tallas][${tallaIndex}][precio]`,
            tallaItem.precio
          );
        });
      }
    });

    const response = await axios.post(`${URL}/agregar-productos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      notifyExitoso("Producto agregado con éxito");
      orderProductos(setProductos);
    } else {
      notifyErroneo("Error al agregar el producto");
    }
  } catch (error) {
    console.error("Error en la petición:", error);
    notifyErroneo("Se produjo un error al agregar el producto.");
  }
};
