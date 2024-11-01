import axios from "axios";
import { URL } from "../../App";
import { notifyErroneo, notifyExitoso, timeOut } from "../../alerts/Alerts";
export const handleEditInfoWeb = async (data) => {
  const { logo, logoLight, titulo, contacto, banners, tipoEnvio, cupones } =
    data;
  try {
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("contacto", JSON.stringify(contacto));
    formData.append("tipoEnvio", JSON.stringify(tipoEnvio));
    formData.append("cupones", JSON.stringify(cupones));
    formData.append("token", JSON.parse(localStorage.getItem("TokenLogin")));

    // Añadir la imagen de portada
    if (logo) {
      formData.append("logo", logo);
    }
    // Añadir la imagen de portada
    if (logoLight) {
      formData.append("logoLight", logoLight);
    }
    if (banners && banners.length > 0) {
      // Añadir las imágenes adicionales
      banners.forEach((banner, index) => {
        if (banner.imagen) {
          formData.append(`imagen${index + 1}`, banner.imagen);
        }
        formData.append(`enlace${index + 1}`, banner.enlace || "");
      });
    }

    const response = await axios.put(`${URL}/edit-infoWeb`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 201) {
      notifyExitoso("Datos cambiados con éxito");
      timeOut("/", 1000);
    } else if (response.status === 205) {
      notifyErroneo("Error al cambiar los datos");
    }
  } catch (error) {
    console.error("Error en la petición:", error);
  }
};

export const clearInfoWeb = async () => {
  try {
    const response = await axios.delete(`${URL}/clear-infoweb`, {
      params: {
        token: JSON.parse(localStorage.getItem("TokenLogin")),
      },
    });
    if (response.status === 200) {
      notifyExitoso("¡Información eliminada con Exito!");
      timeOut("/", 1000);
    }
  } catch (error) {
    console.log(error);
    notifyErroneo("Error al eliminar productos");
  }
};
