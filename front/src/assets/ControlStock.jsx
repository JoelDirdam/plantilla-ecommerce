import React from "react";
import { Paper, Grid, Typography } from "@mui/material";
import { URL } from "../App";

export default function ControlStock({ productos }) {
  const productosSinStock = productos.filter((producto) => {
    // Caso 1: Si el producto es controlado por stock general y la cantidad es 0
    if (producto.cantidadStock.porStock && producto.cantidadStock.cant === 0) {
      return true;
    }

    if (producto.cantidadStock.porStock) {
      return producto.cantidadStock.cant === 0;
    }

    // Para los productos que no son por stock general (porStock === false)
    // Filtrar las variantes que tengan tallas con stock 0
    producto.variantes = producto.variantes
      .map((variante) => {
        variante.tallas = variante.tallas.filter((talla) => talla.stock === 0);
        return variante;
      })
      .filter((variante) => variante.tallas.length > 0);

    // Si después de filtrar, el producto tiene variantes sin tallas con stock, lo eliminamos
    return producto.variantes.length > 0;
  });

  return (
    <div className="container-productos">
      <h1>Productos Sin Stock</h1>
      <hr />
      <br />
      {productosSinStock.length > 0 ? (
        <Grid container spacing={4} mt={5} mb={10}>
          {productosSinStock.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto._id}>
              <Paper
                elevation={4}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <a
                  href={`/producto/${producto._id}`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Typography variant="h6" gutterBottom>
                    {producto.titulo}
                  </Typography>
                  <img
                    src={`${URL}${producto.imagenPortada}`}
                    alt={producto.titulo}
                    style={{
                      width: "100%",
                      height: "300px",
                      borderRadius: "5px",
                      objectFit: "contain",
                    }}
                  />
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    Sin Stock
                  </p>
                  {producto.variantes.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      {producto.variantes.map((variante) => (
                        <div
                          key={variante._id}
                          style={{ marginBottom: "10px" }}
                        >
                          {variante.color && (
                            <Typography variant="body2">
                              <strong>Color:</strong>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "15px",
                                  height: "15px",
                                  background: variante.color,
                                  borderRadius: "50%",
                                  border: "1px solid black",
                                  marginRight: "10px",
                                  marginLeft: "5px",
                                }}
                              ></span>
                            </Typography>
                          )}
                          {variante.tallas.length > 0 && (
                            <Typography variant="body2">
                              <strong>Tallas:</strong>{" "}
                              {variante.tallas
                                .map((talla) => talla.talla)
                                .join(", ")}
                            </Typography>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </a>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">No hay productos sin stock.</Typography>
      )}
    </div>
  );
}
