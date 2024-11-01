import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import {
  formatearPrecio,
  handleCategoryClick,
  handleKeyPress,
  handleSearch,
  resetFilters,
} from "../FuncionesProductos";

function valuetext(value) {
  return `${value}€`;
}
export default function ListaCategoriasProductos({
  setLoading,
  searchTerm,
  setSearchTerm,
  setFilteredTerm,
  setSelectedCategory,
  setSortOrder,
  setPriceRange,
  minPrice,
  maxPrice,
  productosData,
  priceRange,
}) {
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  // Extraer y unificar todas las categorías
  const todasCategorias = productosData.flatMap((producto) =>
    producto.categorias[0].split(",").map((cat) => cat.trim())
  );

  // Eliminar duplicados usando Set
  const categoriasUnicas = [...new Set(todasCategorias)];
  return (
    <div className="lista-categorias">
      <div className="filtro-productos">
        {/* barra-busqueda */}
        <div className="barra-busqueda">
          <input
            type="text"
            placeholder="BUSCAR"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) =>
              handleKeyPress(e, setLoading, setFilteredTerm, searchTerm)
            }
          />
          <button
            onClick={() =>
              handleSearch(setLoading, setFilteredTerm, searchTerm)
            }
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      {/* Botón para restablecer filtros */}
      <div className="reset-filters">
        <button
          onClick={() =>
            resetFilters(
              setSearchTerm,
              setFilteredTerm,
              setSelectedCategory,
              setSortOrder,
              setPriceRange,
              minPrice,
              maxPrice
            )
          }
        >
          Restablecer Filtros
        </button>
      </div>
      <div>
        <h1>Categorías del producto</h1>
        {categoriasUnicas.map((categoria, index) => (
          <div
            key={index}
            onClick={() =>
              handleCategoryClick(categoria, setLoading, setSelectedCategory)
            }
            className="categoria-item"
          >
            <p>{categoria}</p>
          </div>
        ))}
      </div>
      {/* filtro de precios */}
      <div className="filtro-precios">
        <h2>Filtrar por Precio</h2>
        <Box sx={{ width: 300 }}>
          <Slider
            getAriaLabel={() => "Rango de precios"}
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            min={minPrice}
            max={maxPrice}
          />
        </Box>
        <p>
          de ${formatearPrecio(minPrice)} hasta ${formatearPrecio(maxPrice)}
        </p>
      </div>
    </div>
  );
}
