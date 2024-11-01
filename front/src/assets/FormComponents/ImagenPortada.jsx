import React, { useState } from "react";

export default function ImagenPortada({
  setImagenPortada,
  setImagenPreviewPortada,
  imagenPreviewPortada,
}) {
  const handlePortadaChange = (event) => {
    const file = event.target.files[0];

    if (file && file instanceof Blob) {
      setImagenPortada(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreviewPortada(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("El archivo seleccionado no es válido o no es un Blob.");
    }
  };
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        onChange={handlePortadaChange}
        style={{ display: "none" }}
      />
      <label htmlFor="fileInput" className="custom-file-upload">
        Seleccionar portada producto*
      </label>
      {imagenPreviewPortada && (
        <div className="imagen-portada">
          <img src={imagenPreviewPortada} alt="Imagen seleccionada" />
        </div>
      )}
    </div>
  );
}
