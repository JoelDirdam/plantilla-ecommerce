import { notifyEsperando } from "../../alerts/Alerts";

export const handleFileChange = (
  event,
  setImagenes,
  setImagenesPreview,
  setImagenesData,
  setVariantes
) => {
  const files = Array.from(event.target.files);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  if (imageFiles.length > 5) {
    notifyEsperando("Solo se permiten hasta 5 imágenes.");
    setImagenes([]);
    setImagenesPreview([]);
    setImagenesData([]);
    return;
  }

  setImagenes(imageFiles);

  const previews = imageFiles.map((file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  });

  Promise.all(previews).then((previews) => {
    setImagenesPreview(previews);
    const initialData = previews.map((preview, index) => ({
      preview,
      color: "",
      talla: "",
      stock: 0,
      file: imageFiles[index], // Almacena el archivo real en la data de variantes
    }));
    setImagenesData(initialData);
    setVariantes(initialData);
  });
};

// handleFileChangeEdit.js
export const handleFileChangeEdit = (
  event,
  setImagenes,
  setImagenesPreview,
  setImagenesData
) => {
  const files = Array.from(event.target.files);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  // Limitar a un máximo de 5 imágenes
  if (imageFiles.length > 5) {
    notifyEsperando("Solo se permiten hasta 5 imágenes.");
    // Limpiar los estados si se excede el límite
    setImagenes([]);
    setImagenesPreview([]);
    setImagenesData([]);
    return;
  }

  // Actualizar el estado con las imágenes seleccionadas
  setImagenes(imageFiles);

  // Crear previews de las imágenes
  const previews = imageFiles.map((file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  });

  // Esperar a que todas las previews se generen
  Promise.all(previews).then((previews) => {
    // Actualizar el estado con previews y datos de imágenes
    setImagenesPreview(previews);
    const initialData = previews.map((preview, index) => ({
      preview,
      color: "",
      talla: "",
      stock: 0,
      file: imageFiles[index], // Almacenar el archivo real en la data
    }));
    setImagenesData(initialData);
  });
};
