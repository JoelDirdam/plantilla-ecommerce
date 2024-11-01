import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifyExitoso = (tarea) =>
  toast.success(tarea, {
    position: "bottom-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

export const notifyErroneo = (tarea) =>
  toast.error(tarea, {
    position: "bottom-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

export const notifyEsperando = (tarea) =>
  toast.info(tarea, {
    position: "bottom-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });
export const timeOut = (ruta, tiempo) => {
  setTimeout(() => {
    window.location.href = `${ruta}`;
  }, tiempo);
};
