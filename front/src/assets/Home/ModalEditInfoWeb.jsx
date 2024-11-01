import React, { useState, useEffect } from "react";
import "../styles/ModalAddNewProducto.css";
import {
  notifyErroneo,
  notifyEsperando,
  notifyExitoso,
} from "../../alerts/Alerts";
import { handleEditInfoWeb } from "./funcionesModalEditInfoWeb";
import ModalClearInfoWeb from "./ModalClearInfoWeb";
import Cupones from "./Cupones";

export default function EditInfoWeb({
  ModalEditInfo,
  setModalEditInfo,
  infoWeb,
}) {
  const initialContacto = infoWeb?.[0]?.contacto || {
    telefono: "",
    email: "",
    instagram: "",
    WhatsApp: "",
  };

  const [logo, setLogo] = useState("");
  const [logoPreview, setLogoPreview] = useState(""); // Vista previa del logo
  const [logoLight, setLogoLight] = useState("");
  const [logoLightPreview, setLogoLightPreview] = useState(""); // Vista previa del logoLight
  const [titulo, setTitulo] = useState(infoWeb?.[0]?.titulo || "");
  const [contacto, setContacto] = useState(initialContacto);
  const [banners, setBanners] = useState([]);
  const [hadleModalClearInfoWeb, setHadleModalClearInfoWeb] = useState(false);
  const [cupones, setCupones] = useState(infoWeb?.[0]?.cupones || []);
  const [tipoEnvio, setTipoEnvio] = useState(
    infoWeb?.[0]?.tipoEnvio || {
      activeEnvio: false, // Activar/desactivar envíos
      cantPrice: 0, // Precio mínimo para envío
    }
  );

  useEffect(() => {
    if (infoWeb && infoWeb.contacto) {
      setContacto(infoWeb[0].contacto);
    }
  }, [infoWeb]);

  useEffect(() => {
    if (logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(logo);
    } else {
      setLogoPreview("");
    }
  }, [logo]);

  useEffect(() => {
    if (logoLight) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoLightPreview(reader.result);
      };
      reader.readAsDataURL(logoLight);
    } else {
      setLogoLightPreview("");
    }
  }, [logoLight]);

  const handleBannerChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBanners = [...banners];
        newBanners[index].imagen = file;
        newBanners[index].preview = reader.result;
        setBanners(newBanners);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const { telefono, email, instagram, WhatsApp } = contacto;

    if (
      !titulo &&
      !telefono &&
      !email &&
      !instagram &&
      !WhatsApp &&
      !logo &&
      !logoLight &&
      !tipoEnvio.activeEnvio &&
      (banners.some((banner) => banner.imagen === "") || banners.length === 0)
    ) {
      notifyEsperando("No se realizaron cambios.");
      return false;
    }
    return true;
  };

  const hasChanges = () => {
    const originalTitulo = infoWeb[0]?.titulo || "";

    const originalContacto = infoWeb[0]?.contacto || {
      telefono: "",
      email: "",
      instagram: "",
      WhatsApp: "",
    };

    // Comparar los valores actuales con los originales
    return (
      titulo !== originalTitulo ||
      contacto.telefono !== originalContacto.telefono ||
      contacto.email !== originalContacto.email ||
      contacto.instagram !== originalContacto.instagram ||
      contacto.WhatsApp !== originalContacto.WhatsApp ||
      banners.length !== infoWeb[0]?.banners.length || // Comparar el número de banners
      tipoEnvio.cantPrice !== infoWeb[0].cantPrice ||
      tipoEnvio.activeEnvio !== infoWeb[0].activeEnvio ||
      originalContacto.banners // activeEnvio: false, // cantPrice: 0,
        .some(
          (banner, index) =>
            banner.imagen !== infoWeb[0]?.banners[index]?.imagen
        )
    );
  };
  // Filtrar cupones antes de enviar los datos
  const getFilteredCupones = () => {
    return cupones.filter(
      (cupon) =>
        cupon.nombre.trim() !== "" && parseFloat(cupon.porcentajeDescuento) > 0
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (titulo === "") {
      notifyEsperando("Debe Colocar un Titulo.");
      return false;
    }
    if (tipoEnvio.activeEnvio && tipoEnvio.cantPrice < 0) {
      notifyEsperando("El precio de envio debe ser mayor o igual a 0.");
      return false;
    }

    if (!validateForm()) return;
    if (!hasChanges()) {
      notifyEsperando(
        "No se realizaron cambios en la información de la tienda."
      );
      return;
    }
    const filteredCupones = getFilteredCupones();

    const data = {
      logo,
      logoLight,
      titulo,
      contacto,
      banners,
      tipoEnvio,
      cupones: filteredCupones,
    };
    try {
      await handleEditInfoWeb(data);
    } catch (error) {
      notifyErroneo("Error al actualizar la información.");
      console.error(error);
    }
  };
  return (
    <>
      <ModalClearInfoWeb
        hadleModalClearInfoWeb={hadleModalClearInfoWeb}
        setHadleModalClearInfoWeb={setHadleModalClearInfoWeb}
      />
      <div
        className={`background ${ModalEditInfo ? "active" : ""}`}
        onClick={() => setModalEditInfo(false)}
      ></div>
      <div className={`ModalAddNewProducto ${ModalEditInfo ? "active" : ""}`}>
        <div className="Modal-add-producto">
          <h1>Editar Información de la Tienda</h1>
          {infoWeb && infoWeb.length > 0 && (
            <button
              onClick={() => setHadleModalClearInfoWeb(true)}
              className="btn"
            >
              Borrar Información
            </button>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="logo">
                Logo oscuro (Se cambia por el actual)
              </label>
              <input
                type="file"
                id="logo"
                style={{ display: "none" }}
                onChange={(e) => setLogo(e.target.files[0])}
              />
              <label htmlFor="logo" className="custom-file-upload">
                Seleccionar Logo oscuro
              </label>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Vista previa del logo"
                  className="image-preview"
                />
              )}
            </div>
            <div>
              <label htmlFor="logoLight">
                Logo Claro (Se cambia por el actual)
              </label>
              <input
                type="file"
                id="logoLight"
                style={{ display: "none" }}
                onChange={(e) => setLogoLight(e.target.files[0])}
              />
              <label htmlFor="logoLight" className="custom-file-upload">
                Seleccionar Logo Claro
              </label>
              {logoLightPreview && (
                <img
                  src={logoLightPreview}
                  alt="Vista previa del logo claro"
                  className="image-preview"
                  style={{ background: "black" }}
                />
              )}
            </div>
            <div>
              <label htmlFor="titulo">
                Título (Nombre y Eslogan de la Empresa)
              </label>
              <input
                type="text"
                id="titulo"
                value={titulo || ""}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <br />

            {/* Sección de envío */}
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={tipoEnvio.activeEnvio}
                  onChange={(e) =>
                    setTipoEnvio({
                      ...tipoEnvio,
                      activeEnvio: e.target.checked,
                    })
                  }
                />{" "}
                Activar Envíos
              </label>
              {tipoEnvio.activeEnvio && (
                <>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      Precio Minimo para Envío Gratis (puede editarse por
                      producto)
                      <br /> <span> *dejar en 0 si es Gratis en general*:</span>
                      <br />
                      <input
                        style={{ marginTop: "10px", width: "6rem" }}
                        type="number"
                        value={tipoEnvio.cantPrice ? tipoEnvio.cantPrice : 0}
                        onChange={(e) =>
                          setTipoEnvio({
                            ...tipoEnvio,
                            cantPrice: e.target.value,
                          })
                        }
                        min="0"
                      />{" "}
                      $
                    </label>
                  </div>
                </>
              )}
            </div>
            <br />
            <div>
              <label>
                <h3>Contacto</h3>
              </label>
            </div>
            <div>
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                value={contacto.telefono || ""}
                onChange={(e) =>
                  setContacto({ ...contacto, telefono: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={contacto.email || ""}
                onChange={(e) =>
                  setContacto({ ...contacto, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="instagram">Instagram (enlace del perfil)</label>
              <input
                type="text"
                id="instagram"
                value={contacto.instagram || ""}
                onChange={(e) =>
                  setContacto({ ...contacto, instagram: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="whatsapp">
                WhatsApp (enlace){" "}
                <a
                  style={{ color: "blue", textDecoration: "none" }}
                  href="https://crear.wa.link/"
                  target="_blank"
                >
                  Generar Enlace
                </a>
              </label>
              <input
                type="text"
                id="whatsapp"
                placeholder="https://api.whatsapp.com/send?phone=*numero*"
                value={contacto.WhatsApp || ""}
                onChange={(e) =>
                  setContacto({ ...contacto, WhatsApp: e.target.value })
                }
              />
            </div>
            <br />
            <div className="banners">
              <label htmlFor="banners">
                Banners (Imagen, Enlace)
                <br /> Se cambian por los ya existentes (Máximo 5)
              </label>
              {banners.map((banner, index) => (
                <div key={index}>
                  <input
                    type="file"
                    id={`banner-${index}`}
                    placeholder="Ruta"
                    style={{ display: "none" }}
                    onChange={(e) => handleBannerChange(e, index)}
                  />
                  <label
                    htmlFor={`banner-${index}`}
                    className="custom-file-upload"
                  >
                    Seleccionar Banner* {index + 1}
                  </label>
                  {banner.preview && (
                    <img
                      src={banner.preview}
                      alt="Vista previa del banner"
                      className="image-preview-banner"
                    />
                  )}
                  <label
                    htmlFor={`enlace-${index + 1}`}
                    style={{ margin: "0" }}
                  >
                    Enlace (solo si el Banner es cliqueable)
                  </label>

                  <input
                    type="text"
                    placeholder="https://coderplate40.com/productos"
                    id={`enlace-${index + 1}`}
                    value={banner.enlace}
                    onChange={(e) => {
                      const newBanners = [...banners];
                      newBanners[index].enlace = e.target.value;
                      setBanners(newBanners);
                    }}
                  />

                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      setBanners(banners.filter((_, i) => i !== index))
                    }
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              {banners.length < 5 && (
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    setBanners([
                      ...banners,
                      { imagen: "", enlace: "", preview: "" },
                    ])
                  }
                >
                  Agregar Banner
                </button>
              )}
            </div>
            <Cupones cupones={cupones} setCupones={setCupones} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <button type="submit" className="btn">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
