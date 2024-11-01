import "./styles/navbar.css";
import logo from "../img/logo1.png";
import { notifyExitoso, timeOut } from "../alerts/Alerts";
import { URL } from "../App";

export default function NavbarNormal({
  infoWeb,
  activeMenuResponsive,
  setActiveMenuResponsive,
  productos,
}) {
  const handleLogout = () => {
    localStorage.removeItem("TokenLogin");
    notifyExitoso("¡Sesión Cerrada con Exito!");
    timeOut("/", 1000);
  };

  const logoUrl = infoWeb?.[0]?.logo ? `${URL}${infoWeb[0].logo}` : logo;

  return (
    <nav className="navbar-container navbar-normal">
      <a href="/">
        <div className="logo">
          <img src={logoUrl} alt="Logo" className="logo-responsive" />
        </div>
      </a>
      <div className="content-navbar navbar-normal">
        <ul className={`list-navbar ${activeMenuResponsive ? "active" : ""}`}>
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
    </nav>
  );
}
