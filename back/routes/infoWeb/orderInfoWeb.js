import StoreInfo from "../../models/StoreInfo.js";

// Function to handle user profile retrieval
const orderInfoWeb = async (req, res) => {
  try {
    const InfoWeb = await StoreInfo.find();

    if (!InfoWeb) {
      // If the user is not found, send a response indicating that
      res.status(205).json({ message: "No hay información." });
      return;
    }
    // If the user is found, send the user data as the response
    res.status(200).json(InfoWeb);
  } catch (error) {
    // Log any errors and send a response indicating that the token is invalid
    console.log(error);
    res.status(404).json({ error: "Problema en buscar la información." });
  }
};

export default orderInfoWeb;
