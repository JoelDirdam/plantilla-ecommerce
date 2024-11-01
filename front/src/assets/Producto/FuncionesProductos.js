// funciones carrito de compras

import axios from "axios";
import { URL } from "../../App";
import { productosData } from "./productosData";

// calcula el precio total de los productos agregados al carrito
export const calcularTotalPrecio = (carrito, setTotalPrecio) => {
  const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
  setTotalPrecio(total);
};

export const eliminarDelCarrito = (
  id,
  carrito,
  setCarrito,
  setCantCarrito,
  setTotalPrecio
) => {
  const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
  setCarrito(nuevoCarrito);
  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  setCantCarrito(nuevoCarrito.length);

  calcularTotalPrecio(nuevoCarrito, setTotalPrecio); // Aquí se recalcula el total
};

// formateo Precio
export const formatearPrecio = (precio) => {
  if (typeof precio !== "number" || isNaN(precio)) {
    return "0,00"; // Retorna un valor predeterminado si el precio no es válido
  }
  return precio.toLocaleString("es-AR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// funciones Productos

// funciones de el input de busqueda de productos
export const handleKeyPress = (
  event,
  setLoading,
  setFilteredTerm,
  searchTerm
) => {
  if (event.key === "Enter") {
    handleSearch(setLoading, setFilteredTerm, searchTerm);
  }
};
export const handleSearch = (setLoading, setFilteredTerm, searchTerm) => {
  setLoading(true);
  setFilteredTerm(searchTerm);
  setLoading(false);
};

// categorias por click
export const handleCategoryClick = (
  category,
  setLoading,
  setSelectedCategory
) => {
  setLoading(true);
  setSelectedCategory(category);
  setLoading(false);
};

// Nueva función para restablecer todos los filtros
export const resetFilters = (
  setSearchTerm,
  setFilteredTerm,
  setSelectedCategory,
  setSortOrder,
  setPriceRange,
  minPrice,
  maxPrice
) => {
  setSearchTerm("");
  setFilteredTerm("");
  setSelectedCategory("");
  setSortOrder("default");
  setPriceRange([minPrice, maxPrice]);
};

// selector de dropdown de productos
export const handleSortChange = (event, setSortOrder) => {
  setSortOrder(event.target.value);
};

// agregar producto al carrito
export const agregarAlCarrito = async (
  producto,
  setCantCarrito,
  setCarrito
) => {
  let carrito = (await JSON.parse(localStorage.getItem("carrito"))) || [];
  const productoExistente = await carrito.find(
    (item) => item.id === producto.id
  );

  if (!productoExistente) {
    carrito.push({
      id: producto.id,
      titulo: producto.titulo,
      imagen: producto.imagen,
      descripcion: producto.descripcion,
      precio: producto.precio,
      precioViejo: producto.precioViejo,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  const carritoCompras = await JSON.parse(localStorage.getItem("carrito"));
  setCantCarrito(carritoCompras.length);
  setCarrito(JSON.parse(localStorage.getItem("carrito")));
};

// obtener productos del carrito
export const obtenerProductosCarrito = (setCarrito, setTotalPrecio) => {
  const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];

  const carritoCompleto = carritoLocal.map((item) => {
    const producto = productosData.find((prod) => prod.id === item.id);
    return {
      ...producto,
    };
  });

  setCarrito(carritoCompleto);
  calcularTotalPrecio(carritoCompleto, setTotalPrecio);
};

// petición para comprar
export const handleRealizarCompra = async (
  e,
  userLogin,
  email,
  productos,
  totalPrecio
) => {
  e.preventDefault();
  if (!email && !userLogin.email) {
    return;
  }
  try {
    let formData;
    if (email) {
      formData = {
        productos: productos,
        email: email,
        precio: totalPrecio,
      };
    } else if (userLogin.email) {
      formData = {
        productos: productos,
        email: userLogin.email,
        precio: totalPrecio,
      };
    } else {
      return;
    }
    try {
      const response = await axios.post(`${URL}/create-order-mp`, formData);
      window.location.href = response.data;
      setIsLoading(false);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      // window.location.href = "/#/Error404";
    }

    // Aquí puedes realizar la petición de compra
    console.log("Realizando compra con el correo:");
  } catch (error) {
    console.error(error);
    // Manejo de errores si la petición falla
  }
};
