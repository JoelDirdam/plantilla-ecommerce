import Productos from "../../models/productos.js";

// Function to handle user profile retrieval
const orderProductos = async (req, res) => {
  // Extract the token from the Authorization header (format: "Bearer token")

  try {
    const productos = await Productos.find();

    // If the user is found, send the user data as the response
    res.status(200).json({ productos: productos });
  } catch (error) {
    // Log any errors and send a response indicating that the token is invalid
    console.log(error);
    res.status(404).json({ error: "Invalid Token!" });
  }
};

export default orderProductos;
