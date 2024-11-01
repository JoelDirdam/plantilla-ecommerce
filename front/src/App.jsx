import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./assets/Home";
import NavbarFixed from "./assets/NavbarFixed";
import NavbarNormal from "./assets/NavbarNormal";
import { ToastContainer } from "react-toastify";
import { changeUser, findUsers } from "./peticiones/findUser";
import Login from "./assets/Login";
import { orderProductos } from "./peticiones/findProductos";
import Spinner from "./Spinner";
import Producto from "./assets/Producto/Producto";
import ProductosLista from "./assets/ProductosLista";
import { orderInfo } from "./peticiones/orderInfo";
import Usuarios from "./assets/Usuarios";
import Usuario from "./assets/Usuario";
import Pedidos from "./assets/Pedidos";
import ControlStock from "./assets/ControlStock";
import Pedido from "./assets/Pedido";
import { orderPedidos } from "./peticiones/OrderPedidos";
import MailSubscripciones from "./assets/MailSubscripciones";

export const URL = import.meta.env.VITE_URL;

function App() {
  const [productos, setProductos] = useState();
  const [activeMenuResponsive, setActiveMenuResponsive] = useState(false);
  const [userLogin, setUser] = useState();
  const [scroll, setScroll] = useState(0);
  const [loading, setLoading] = useState(true);
  const [infoWeb, setInfoWeb] = useState();
  const [users, setUsers] = useState();
  const [contentVisible, setContentVisible] = useState(false); // Nuevo estado para controlar la visibilidad
  const [pedidos, setPedidos] = useState([]);

  const ref = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const div = ref.current;
      const { y } = div.getBoundingClientRect();
      const scroll = y;
      setScroll(scroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOrderProductos = async () => {
    await orderProductos(setProductos);
  };

  useEffect(() => {
    handleOrderProductos();
  }, []);

  const handleUser = async () => {
    await changeUser(setUser);
    await orderInfo(setInfoWeb);
    await findUsers(setUsers);
    await orderPedidos(setPedidos);
    setLoading(false);
    // Después de que se haya terminado la carga, muestra el contenido con un pequeño retraso para la animación
    setTimeout(() => setContentVisible(true), 300); // 300ms de retraso antes de mostrar el contenido
  };

  useEffect(() => {
    const loadUserAndData = async () => {
      await handleUser();
    };
    loadUserAndData();
  }, []);

  useEffect(() => {
    if (userLogin && userLogin.tipoCuenta !== "Admin") {
      setUser(null); // Limpiar el estado del usuario
      localStorage.removeItem("TokenLogin"); // Eliminar el token del localStorage
      window.location.href = "/"; // Redirigir a la página de inicio de sesión
    }
  }, [userLogin]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!userLogin ? (
            <Login />
          ) : (
            <>
              <div
                className={`btn-subir ${scroll <= -259.71875 ? "scroll" : ""}`}
              ></div>
              <div
                className={`App ${contentVisible ? "fade-in" : ""}`} // Agregar la clase fade-in cuando el contenido esté listo
                ref={ref}
              >
                <BrowserRouter>
                  <nav></nav>
                  <NavbarNormal
                    userLogin={userLogin}
                    activeMenuResponsive={activeMenuResponsive}
                    setActiveMenuResponsive={setActiveMenuResponsive}
                    infoWeb={infoWeb}
                    productos={productos}
                  />
                  <NavbarFixed
                    userLogin={userLogin}
                    activeMenuResponsive={activeMenuResponsive}
                    setActiveMenuResponsive={setActiveMenuResponsive}
                    infoWeb={infoWeb}
                    productos={productos}
                  />

                  <div
                    onClick={() => setActiveMenuResponsive(false)}
                    className="container"
                  >
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <Home
                            productos={productos}
                            setProductos={setProductos}
                            infoWeb={infoWeb}
                          />
                        }
                      />
                      <Route
                        path="/productos"
                        element={
                          <ProductosLista
                            productos={productos}
                            setProductos={setProductos}
                          />
                        }
                      />
                      <Route
                        path="/MailSubscripciones"
                        element={<MailSubscripciones infoWeb={infoWeb} />}
                      />
                      <Route
                        path="/producto/:id"
                        element={<Producto productos={productos} />}
                      />
                      <Route
                        path="/pedidos"
                        element={<Pedidos pedidos={pedidos} />}
                      />
                      <Route
                        path="/pedidos/:id"
                        element={<Pedido pedidos={pedidos} />}
                      />
                      <Route
                        path="/Control-Stock"
                        element={<ControlStock productos={productos} />}
                      />
                      <Route
                        path="/usuarios"
                        element={<Usuarios setUsers={setUsers} users={users} />}
                      />
                      <Route
                        path="/usuario/:id"
                        element={
                          <Usuario
                            setUsers={setUsers}
                            users={users}
                            pedidos={pedidos}
                          />
                        }
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </div>
                </BrowserRouter>
              </div>
            </>
          )}
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
