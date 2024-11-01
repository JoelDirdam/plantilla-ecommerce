import { notifyEsperando } from "../../../alerts/Alerts";

export const validateFormEditModal = (imagenPortada, imagenesData) => {
  // Verificar imagen de portada
  if (!imagenPortada) {
    notifyEsperando("Por favor, coloque una imagen de portada.");
    return false;
  }

  // Verificar que imagenesData contenga al menos una imagen en formato imagen o preview
  const tieneImagen = imagenesData.some((item) => item.imagen || item.preview);
  if (!tieneImagen) {
    notifyEsperando("Por favor, agregue al menos una imagen del producto.");
    return false;
  }

  // Verificar color en imagenesData
  const colores = imagenesData
    .map((item) => item.color)
    .filter((color) => color); // Filtrar colores no vacíos
  const cantidadColores = colores.length;

  if (cantidadColores > 1) {
    // Filtrar los colores que no son null o ""
    const coloresValidos = imagenesData
      .map((item) => item.color)
      .filter((color) => color && color !== "null" && color.trim() !== "");

    // Verificar colores repetidos
    const coloresUnicos = new Set(coloresValidos);
    if (coloresUnicos.size !== coloresValidos.length) {
      notifyEsperando("Existen colores repetidos.");
      return false;
    }
  }

  // Verificar tallas en imagenesData
  const tieneTallas = imagenesData.some(
    (item) => item.tallas && item.tallas.length > 0
  );
  if (tieneTallas) {
    const todasTienenTallas = imagenesData.every(
      (item) => item.tallas && item.tallas.length > 0
    );
    // if (!todasTienenTallas) {
    //   notifyEsperando(
    //     "Si alguna imagen tiene talles, todas deben tener talles."
    //   );
    //   return false;
    // }

    // Verificar tallas individuales
    for (const item of imagenesData) {
      if (item.tallas && item.tallas.length > 0) {
        for (const talla of item.tallas) {
          if (!talla.talla) {
            notifyEsperando("Ninguna talla puede estar vacía.");
            return false;
          }
          // if (parseInt(talla.stock, 10) <= 0) {
          //   notifyEsperando("Ninguna talla puede tener stock 0.");
          //   return false;
          // }
        }
      }
    }
  }

  return true;
};

export const shouldShowCantidadStock = (tallesAgregados) => {
  if (tallesAgregados && tallesAgregados.length > 0) {
    return tallesAgregados.some(
      (item) => item.tallas && item.tallas.length > 0
    );
  }
  return false;
};
