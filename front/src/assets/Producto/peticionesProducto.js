import axios from "axios";
import { URL } from "../../App";
import {
  notifyErroneo,
  notifyEsperando,
  notifyExitoso,
  timeOut,
} from "../../alerts/Alerts";

export const eliminarProducto = async (id) => {
  try {
    const token = JSON.parse(localStorage.getItem("TokenLogin"));
    const response = await axios.delete(
      `${URL}/delete-producto/${id}/${token}`
    );
    if (response.status === 200) {
      notifyExitoso("¡Producto eliminado con exito!");
      timeOut("/productos", 500);
    } else {
      notifyEsperando("¡No se pudo eliminar el producto!");
    }
  } catch (error) {
    console.error(error);
  }
};

// Helper function to convert base64 to File
const base64ToFile = (base64String, filename) => {
  const [metadata, data] = base64String.split(",");
  const mime = metadata.match(/:(.*?);/)[1];
  const binary = atob(data);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new File([new Uint8Array(array)], filename, { type: mime });
};

export const handleEditProducto = async (data, setHadleModalEditProducto) => {
  try {
    const {
      id,
      titulo,
      descripcion,
      precio,
      precioViejo,
      sale,
      imagenPortada,
      categorias,
      porStock,
      cantidadStock,
      estado,
      cuotas,
      variantes,
      porcentajeEnvio,
    } = data;

    // Crear un nuevo objeto FormData
    const formData = new FormData();

    // Agregar datos generales al FormData
    formData.append("id", id);
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("precioViejo", precioViejo);
    formData.append("sale", sale);
    formData.append("categorias", categorias);
    formData.append("token", JSON.parse(localStorage.getItem("TokenLogin")));
    // Crear un objeto para cantidadStock
    const cantidadStockObj = {
      porStock,
      cant: porStock ? cantidadStock : 0,
    };

    formData.append("cantidadStock", JSON.stringify(cantidadStockObj));
    formData.append("estado", estado);
    formData.append("cuotas", JSON.stringify(cuotas));
    formData.append("porcentajeEnvio", porcentajeEnvio);

    // Verificar y agregar imagenPortada si es un archivo
    if (imagenPortada instanceof File) {
      formData.append("imagenPortada", imagenPortada);
    } else if (imagenPortada) {
      // Para URLs, solo lo añadimos como string
      formData.append("imagenPortada", imagenPortada);
    }
    // Añadir las variantes
    variantes.forEach((variante, index) => {
      if (variante.file) {
        formData.append(`variantes[${index}][imagen]`, variante.file); // Imagen como archivo
      }
      formData.append(`variantes[${index}][color]`, variante.color);
      formData.append(`variantes[${index}][id]`, variante._id);

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

    // Realizar la petición PUT
    const response = await axios.put(`${URL}/edit-producto`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      notifyExitoso("¡Producto Editado con éxito!");
      // setHadleModalEditProducto(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (response.status === 205) {
      notifyErroneo("¡Hubo un error al actualizar los cambios!");
    }
  } catch (error) {
    console.error(error);
  }
};
