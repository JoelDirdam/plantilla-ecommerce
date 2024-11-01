import { notifyEsperando } from "../alerts/Alerts";

export const validateForm = (
  imagenPortada,
  variantes,
  imagenes,
  precio,
  precioViejo,
  porStock,
  cantidadStock,
  tallesAgregados,
  porcentajeEnvio
) => {
  if (!imagenPortada) {
    notifyEsperando("Por favor Ponga una Imagen de Portada.");
    return false;
  } else if (imagenes.length === 0) {
    notifyEsperando("Por favor al menos 1 imagen del producto.");
    return false;
  } else if (precio <= 0) {
    notifyEsperando("El Precio debe ser mayor a 0.");
    return false;
  } else if (precioViejo != 0 && precio >= precioViejo) {
    notifyEsperando("Precio Viejo/Tachado debe ser mayor al Precio.");
    return false;
  }
  if (porcentajeEnvio < 0) {
    notifyEsperando(
      "El porcentaje para el envío debe ser igual o mayor que 0."
    );
    return false;
  }

  // Validaciones de variantes
  const algunaTalla = variantes.some((variant) => variant.talla);
  const todasTienenTalla = variantes.every((variant) => variant.talla);
  if (tallesAgregados) {
    for (const item of tallesAgregados) {
      if (item.tallas.length > 0) {
        // Si hay tallas, verificar que no tengan stock en 0 y que la talla no esté vacía
        for (const talla of item.tallas) {
          if (!talla.talla) {
            notifyEsperando("Ningún talle puede estar vacía.");
            return false;
          }
        }
      }
    }
  }
  const todasTallasConStock = variantes.every(
    (variant) =>
      !variant.talla ||
      (variant.tallas && variant.tallas.every((talla) => talla.stock > 0))
  );
  if (algunaTalla && !todasTallasConStock) {
    notifyEsperando("Cada talle debe tener un stock válido.");
    return false;
  }

  if (tallesAgregados) {
    const colores = tallesAgregados.map((item) => item.color);
    const coloresValidos = colores.filter((color) => color); // Filtrar colores no vacíos
    const cantidadColores = coloresValidos.length; // Contar colores válidos

    // Si hay más de un color válido, entonces todos deben tener color
    // if (
    //   cantidadColores > 1 &&
    //   coloresValidos.length !== tallesAgregados.length
    // ) {
    //   notifyEsperando(
    //     "Si hay más de una variante con color, todas deben tener color."
    //   );
    //   return false;
    // }

    // Validar que los colores no vacíos sean únicos
    const coloresUnicos = new Set(coloresValidos);
    if (coloresUnicos.size !== coloresValidos.length) {
      notifyEsperando("Los colores definidos deben ser diferentes entre sí.");
      return false;
    }

    // Validar si uno tiene tallas, todos deben tener al menos una talla no vacía
    const algunObjetoConTallas = tallesAgregados.some(
      (item) => item.tallas.length > 0
    );
    const todosTienenTallas = tallesAgregados.every(
      (item) =>
        item.tallas.length > 0 && item.tallas.every((talla) => talla.talla)
    );
    // if (algunObjetoConTallas && !todosTienenTallas) {
    //   notifyEsperando(
    //     "Si uno de las variantes tiene talles, todos deben tener al menos un talle valido."
    //   );
    //   return false;
    // }
  }
  return true;
};

export const shouldShowCantidadStock = (tallesAgregados) => {
  // Verifica si tallesAgregados es un array y tiene elementos
  if (tallesAgregados && tallesAgregados.length > 0) {
    // Itera sobre cada item en tallesAgregados
    for (let i = 0; i < tallesAgregados.length; i++) {
      // Si en algún caso hay tallas asignadas, devuelve true
      if (tallesAgregados[i].tallas && tallesAgregados[i].tallas.length > 0) {
        return false;
      }
    }
  }
  // Si no hay tallas en ningún caso, devuelve false
  return true;
};
