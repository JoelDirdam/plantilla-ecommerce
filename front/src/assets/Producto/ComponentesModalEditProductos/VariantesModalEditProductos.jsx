import React, { useState, useEffect } from "react";
import { handleFileChangeEdit } from "../../FormComponents/funcionesImagenesProductos";
import { notifyEsperando } from "../../../alerts/Alerts";
import { URL } from "../../../App";

export default function VariantesModalEditProductos({
  imagenesPreview,
  setImagenes,
  setImagenesPreview,
  imagenesData,
  setImagenesData,
  porStock,
  setPorStock,
}) {
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const showStockSection = porStock !== true;

  // Verificar si un color ya ha sido seleccionado
  const isColorDuplicate = (color) => {
    return imagenesData.some((imagen) => imagen.color === color);
  };

  // Manejar el cambio en las tallas dentro de un color
  const handleTallaChange = (index, tallaIndex, field, value) => {
    const updatedData = [...imagenesData];
    if (!updatedData[index].tallas) {
      updatedData[index].tallas = [];
    }
    updatedData[index].tallas[tallaIndex][field] = value.toUpperCase(); // Convertir a mayúsculas
    setImagenesData(updatedData);
  };

  // Añadir una nueva talla
  const handleAddTalla = (index) => {
    const updatedData = [...imagenesData];
    if (!updatedData[index].tallas) {
      updatedData[index].tallas = [];
    }
    updatedData[index].tallas.push({ talla: "", stock: 0, precio: 0 });
    setPorStock(false);
    setImagenesData(updatedData);
  };

  // Eliminar una talla
  const handleRemoveTalla = (index, tallaIndex) => {
    const updatedData = [...imagenesData];
    updatedData[index].tallas.splice(tallaIndex, 1);
    setImagenesData(updatedData);
  };

  // Solo mostrar la sección de tallas si el color está seleccionado
  const handleColorToggle = (index) => {
    const updatedData = [...imagenesData];
    if (updatedData[index].color === "") {
      updatedData[index].color = "#ffffff"; // Color por defecto si se selecciona
      setColorPickerOpen(index); // Abre el picker si se selecciona
    } else {
      updatedData[index].color = "";
    }
    setImagenesData(updatedData);
  };

  // Manejar cambios de color con verificación de duplicados
  const handleColorChange = (index, e) => {
    const selectedColor = e.target.value;
    if (isColorDuplicate(selectedColor)) {
      notifyEsperando(`El color ${selectedColor} ya ha sido seleccionado.`);
    } else {
      const updatedData = [...imagenesData];
      updatedData[index].color = selectedColor;
      setImagenesData(updatedData);
    }
  };

  const renderImage = (imagen, index) => {
    if (typeof imagen === "string") {
      // Si es una URL base64
      if (imagen.startsWith("data:image/")) {
        return <img src={imagen} alt={`Imagen ${index + 1}`} />;
      }
      // Si es una URL de tipo blob
      else if (imagen.startsWith("blob:")) {
        return (
          <img src={URL.createObjectURL(imagen)} alt={`Imagen ${index + 1}`} />
        );
      }
      // Si es una URL relativa o absoluta
      else if (imagen.startsWith("/")) {
        return <img src={`${URL}${imagen}`} alt={`Imagen ${index + 1}`} />;
      }
      // Si es una URL de tipo HTTP/HTTPS
      else if (imagen.startsWith("http://") || imagen.startsWith("https://")) {
        return <img src={imagen} alt={`Imagen ${index + 1}`} />;
      }
    }
    return <span>No hay imagen disponible</span>;
  };

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      imagenesPreview.forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagenesPreview]);

  return (
    <div>
      {/* Input de archivo */}
      <input
        type="file"
        accept="image/*"
        multiple
        id="fileInput-imagenes"
        onChange={(e) =>
          handleFileChangeEdit(
            e,
            setImagenes,
            setImagenesPreview,
            setImagenesData
          )
        }
        style={{ display: "none" }}
      />
      <label htmlFor="fileInput-imagenes" className="custom-file-upload">
        Seleccionar imágenes producto* (máximo 5)
      </label>
      <div className="imagenes-preview">
        {imagenesData.map((imagen, index) => (
          <div key={index} className="imagen-container">
            {/* Mostrar imagen, ya sea URL o recién subida */}
            {renderImage(imagen.imagen || imagenesPreview[index], index)}

            <div className="imagen-inputs">
              <label>
                <input
                  type="checkbox"
                  checked={imagenesData[index]?.color !== ""}
                  onChange={() => handleColorToggle(index)}
                />{" "}
                Color (en caso de ser necesario)
              </label>

              {imagenesData[index]?.color && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        backgroundColor: imagenesData[index]?.color,
                        border: "1px solid #000",
                        borderRadius: "4px",
                      }}
                    ></span>
                    <span>{imagenesData[index]?.color}</span>
                  </div>

                  <div className="color-picker">
                    <label>
                      Elegir color:
                      <input
                        type="color"
                        value={imagenesData[index]?.color || "#ffffff"}
                        onChange={(e) => handleColorChange(index, e)}
                        style={{ marginLeft: "8px" }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Mostrar sección de tallas solo si el color está seleccionado */}
              {imagenesData[index]?.color && (
                <div>
                  <label>
                    Añadir talles y stock
                    <button
                      type="button"
                      onClick={() => handleAddTalla(index)}
                      className="btn"
                    >
                      Añadir talle
                    </button>
                  </label>

                  {imagenesData[index]?.tallas &&
                    imagenesData[index].tallas.map((talla, tallaIndex) => (
                      <div key={tallaIndex}>
                        <label>
                          Talle:
                          <input
                            type="text"
                            value={talla.talla || ""}
                            onChange={(e) =>
                              handleTallaChange(
                                index,
                                tallaIndex,
                                "talla",
                                e.target.value
                              )
                            }
                          />
                        </label>
                        <br />
                        <br />
                        {showStockSection && (
                          <label>
                            Stock:
                            <input
                              type="number"
                              value={talla.stock || 0}
                              onChange={(e) =>
                                handleTallaChange(
                                  index,
                                  tallaIndex,
                                  "stock",
                                  e.target.value
                                )
                              }
                              min="0"
                            />
                          </label>
                        )}
                        <br />
                        <br />
                        {showStockSection && (
                          <label>
                            Precio: (Si se deja en 0 se tomará el precio
                            "general")
                            <input
                              type="number"
                              value={talla.precio || 0}
                              onChange={(e) =>
                                handleTallaChange(
                                  index,
                                  tallaIndex,
                                  "precio",
                                  e.target.value
                                )
                              }
                              min="0"
                            />
                          </label>
                        )}
                        <br />
                        <br />
                        <button
                          type="button"
                          onClick={() => handleRemoveTalla(index, tallaIndex)}
                          className="btn"
                        >
                          Eliminar
                        </button>
                        <hr />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
