import ModalEditInfoWeb from "./Home/ModalEditInfoWeb";
import { useState } from "react";
import "./styles/home.css";
import { URL } from "../App";
import Instagram_icon from "../img/Instagram_icon.webp";
import email_icon from "../img/email-icon.webp";
import WhatsApp_icon from "../img/WhatsApp_icon.webp";
import { formatearPrecio } from "../peticiones/findProductos";

export default function Home({ infoWeb }) {
  const [ModalEditInfo, setModalEditInfo] = useState(false);

  const { logo, logoLight, titulo, contacto, banners, tipoEnvio } =
    infoWeb[0] || {};
  const { telefono, email, instagram, WhatsApp } = contacto || {};

  return (
    <>
      <ModalEditInfoWeb
        ModalEditInfo={ModalEditInfo}
        setModalEditInfo={setModalEditInfo}
        infoWeb={infoWeb}
      />
      <div className="container-btns">
        <button className="btn" onClick={() => setModalEditInfo(true)}>
          Editar Información de la Tienda
        </button>
      </div>
      <br />
      <hr />
      {infoWeb?.length > 0 ? (
        <div className="infoweb-container">
          <div className="infoweb-container-logos">
            {logo && (
              <div className="logo-oscuro">
                <h1>Logo oscuro</h1>
                <img src={`${URL}${logo}`} alt="Logo oscuro" />
              </div>
            )}
            {logoLight && (
              <div className="logo-Claro">
                <h1>Logo Claro</h1>
                <img src={`${URL}${logoLight}`} alt="Logo claro" />
              </div>
            )}
          </div>
          <br />
          <div className="infoweb-informacion">
            {titulo && <h1>{titulo}</h1>}
            <br />
            {(WhatsApp || email || instagram || telefono) && (
              <div>
                <h3>Contacto</h3>
              </div>
            )}
            {WhatsApp && (
              <p>
                <strong>
                  <img src={WhatsApp_icon} alt="WhatsApp" /> WhatsApp:
                </strong>{" "}
                <a href={WhatsApp} target="_blank">
                  {WhatsApp}
                </a>
              </p>
            )}
            {email && (
              <p>
                <strong>
                  <img src={email_icon} alt="Email" /> Email:
                </strong>{" "}
                <a href={`mailto:${email}`} target="_blank">
                  {" "}
                  {email}
                </a>
              </p>
            )}
            {instagram && (
              <p>
                <strong>
                  <img src={Instagram_icon} alt="Instagram" /> Instagram:
                </strong>{" "}
                <a href={instagram} target="_blank">
                  {instagram}
                </a>
              </p>
            )}
            {telefono && (
              <p>
                <strong>
                  <i className="fa-solid fa-phone"></i>Telefono:
                </strong>{" "}
                {telefono}
              </p>
            )}{" "}
            <br />
            {tipoEnvio && tipoEnvio.activeEnvio ? (
              <div>
                <strong>
                  {tipoEnvio.cantPrice > 0 ? (
                    <span>
                      Envíos Gratis a partir de $
                      {formatearPrecio(parseFloat(tipoEnvio.cantPrice))}
                    </span>
                  ) : (
                    <span>
                      El Envío es Gratis en general (Puede Cobrarse por cada
                      producto)
                    </span>
                  )}
                </strong>
              </div>
            ) : (
              <span>
                <strong>No se Realizan Envios</strong>
              </span>
            )}
            <br />
            <div className="cupones" style={{ margin: "10px 0" }}>
              {infoWeb[0].cupones && infoWeb[0].cupones.length > 0 && (
                <>
                  <h3>Cupones</h3>
                  {infoWeb[0].cupones.map((cupon, index) => (
                    <div
                      key={index}
                      style={{
                        marginTop: "10px",
                        borderBottom: "1px solid #000",
                        borderTop: "1px solid #000",
                      }}
                    >
                      <p>
                        <strong>Nombre: {cupon.nombre}</strong>
                      </p>
                      <p>
                        <strong>Descuento: {cupon.porcentajeDescuento}%</strong>
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
            {banners?.length > 0 && (
              <>
                <h3>Banners</h3>
                <div className="banners">
                  {banners.map((banner, index) => (
                    <div key={index}>
                      <img
                        src={`${URL}${banner.imagen}`}
                        alt={`Banner ${index + 1}`}
                        className="banner-image"
                      />
                      {banner.enlace ? (
                        <p style={{ textAlign: "center", color: "blue" }}>
                          <a
                            href={banner.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "blue" }}
                          >
                            Enlace de banner
                          </a>
                        </p>
                      ) : (
                        <p style={{ textAlign: "center", color: "blue" }}>
                          No hay Enlace
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}{" "}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <h1>No hay información de la tienda</h1>
        </div>
      )}
    </>
  );
}
