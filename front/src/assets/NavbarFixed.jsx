import { useEffect, useState } from "react";
import "./styles/navbar.css";
import logo from "../img/logo1.png";
import logo2 from "../img/logo2.png";
import { notifyExitoso, timeOut } from "../alerts/Alerts";
import { URL } from "../App";

export default function NavbarFixed({
  infoWeb,
  activeMenuResponsive,
  setActiveMenuResponsive,
  productos,
}) {
  const [scrolledDown, setScrolledDown] = useState(false);

  const handleActiveMenuResponsive = () => {
    setActiveMenuResponsive(!activeMenuResponsive);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolledDown(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("TokenLogin");
    notifyExitoso("¡Sesión Cerrada con Exito!");
    timeOut("/", 1000);
  };

  const containerClassName = scrolledDown ? "Mostrar-fixed" : "";
  const hasInfoWeb = infoWeb && infoWeb.length > 0;
  const logoUrl =
    hasInfoWeb && infoWeb[0].logo ? `${URL}${infoWeb[0].logo}` : logo;
  const logoLightUrl =
    hasInfoWeb && infoWeb[0].logoLight
      ? `${URL}${infoWeb[0].logoLight}`
      : logo2;

  return (
    <>
      <div
        className={`background navbar ${activeMenuResponsive ? "active" : ""}`}
        onClick={() => setActiveMenuResponsive(false)}
      ></div>
      <nav className={`navbar-container navbar-fixed ${containerClassName}`}>
        <a href="/">
          <div className="logo">
            <img src={logoUrl} alt="" className="logo-normal" />
            <img src={logoLightUrl} alt="" className="logo-responsive" />
          </div>
        </a>
        <div className="content-navbar fixed">
          <ul className="list-navbar fixed">
            <a href="/">
              <li>Inicio</li>
            </a>
            <a href="/productos">
              <li>Productos</li>
            </a>
            {productos.length > 0 && (
              <a href="/control-stock">
                <li>Control Stock</li>
              </a>
            )}
            <a href="/pedidos">
              <li>Pedidos</li>
            </a>
            <a href="/MailSubscripciones">
              <li>Envio Mensajes</li>
            </a>
            <a href="/usuarios">
              <li>Usuarios</li>
            </a>
            <a onClick={handleLogout}>
              <li>Salir</li>
            </a>
          </ul>
        </div>
        <div className="btn-responsive">
          <i
            className="fa-solid fa-bars"
            onClick={handleActiveMenuResponsive}
          ></i>
        </div>
      </nav>
      {/* NAVBAR PARA RESPONSIVE */}
      <div
        className={`content-navbar fixed-prueba ${
          activeMenuResponsive ? "active" : ""
        }`}
      >
        <ul className="list-navbar fixed">
          <a href="/" onClick={handleActiveMenuResponsive}>
            <li>Inicio</li>
          </a>
          <a href="/productos" onClick={handleActiveMenuResponsive}>
            <li>Productos</li>
          </a>
          {productos.length > 0 && (
            <a href="/control-stock" onClick={handleActiveMenuResponsive}>
              <li>Control Stock</li>
            </a>
          )}

          <a href="/pedidos" onClick={handleActiveMenuResponsive}>
            <li>Pedidos</li>
          </a>
          <a href="/MailSubscripciones">
            <li>Envio Mensajes</li>
          </a>
          <a href="/usuarios" onClick={handleActiveMenuResponsive}>
            <li>Usuarios</li>
          </a>
          <a onClick={handleLogout}>
            <li>Salir</li>
          </a>
        </ul>
      </div>
    </>
  );
}
