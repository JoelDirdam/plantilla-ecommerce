import React, { useState } from "react";
import { handleFileChange } from "./funcionesImagenesProductos";
import { notifyEsperando } from "../../alerts/Alerts";

// Dentro de tu componente que maneja las imágenes de producto:
export default function ImagenesProductos({
  imagenesPreview,
  setImagenes,
  setImagenesPreview,
  setVariantes,
  imagenesData,
  setImagenesData,
  porStock,
  setTallesAgregados,
  setPorStock,
}) {
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const showStockSection = porStock !== true;
  // Verificar si un color ya ha sido seleccionado
  const isColorDuplicate = (color) => {
    return imagenesData.some((imagen) => imagen.color === color);
  };

  // Actualizar el estado de talles agregados
  const updateTallesAgregados = (data) => {
    const tallesAgregados = data.map((imagen) => ({
      color: imagen.color,
      tallas: imagen.tallas || [],
    }));
    setTallesAgregados(tallesAgregados);
  };

  // Maneja el cambio en las tallas dentro de un color
  const handleTallaChange = (index, tallaIndex, field, value) => {
    const updatedData = [...imagenesData];
    if (!updatedData[index].tallas) {
      updatedData[index].tallas = [];
    }
    updatedData[index].tallas[tallaIndex][field] = value.toUpperCase();
    setImagenesData(updatedData);
    setVariantes(updatedData);
    updateTallesAgregados(updatedData); // Actualizar talles agregados
  };

  // Añadir una nueva talla
  const handleAddTalla = (index) => {
    const updatedData = [...imagenesData];
    if (!updatedData[index].tallas) {
      updatedData[index].tallas = [];
    }
    updatedData[index].tallas.push({ talla: "", stock: 0, precio: 0 });
    setImagenesData(updatedData);
    setVariantes(updatedData);
    setPorStock(false);
    updateTallesAgregados(updatedData); // Actualizar talles agregados
  };

  // Eliminar una talla
  const handleRemoveTalla = (index, tallaIndex) => {
    const updatedData = [...imagenesData];
    updatedData[index].tallas.splice(tallaIndex, 1);
    setImagenesData(updatedData);
    setVariantes(updatedData);
    updateTallesAgregados(updatedData); // Actualizar talles agregados
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
    updateTallesAgregados(updatedData);
    setImagenesData(updatedData);
    setVariantes(updatedData);
  };

  // Manejar cambios de color con verificación de duplicados
  const handleColorChange = (index, e) => {
    const selectedColor = e.target.value;
    if (isColorDuplicate(selectedColor)) {
      notifyEsperando(`El color ${selectedColor} ya ha sido seleccionado.`);
    } else {
      const updatedData = [...imagenesData];
      updatedData[index].color = selectedColor;
      updateTallesAgregados(updatedData);
      setImagenesData(updatedData);
      setVariantes(updatedData);
    }
  };

  return (
    <div>
      {/* Input de archivo */}
      <input
        type="file"
        accept="image/*"
        multiple
        id="fileInput-imagenes"
        onChange={(e) =>
          handleFileChange(
            e,
            setImagenes,
            setImagenesPreview,
            setImagenesData,
            setVariantes
          )
        }
        style={{ display: "none" }}
      />
      <label htmlFor="fileInput-imagenes" className="custom-file-upload">
        Seleccionar imágenes producto* (máximo 5)
      </label>
      <div className="imagenes-preview">
        {imagenesPreview.map((preview, index) => (
          <div key={index} className="imagen-container">
            <img src={preview} alt={`Imagen ${index + 1}`} />
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
