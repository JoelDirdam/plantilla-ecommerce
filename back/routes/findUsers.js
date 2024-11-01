import User from "../models/users.js";

// Function to handle user profile retrieval
const findUsers = async (req, res) => {
  try {
    // Find the user by email
    const users = await User.find();

    if (!users) {
      // If the user is not found, send a response indicating that
      res.status(205).json({ message: "Users Not Found" });
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    // Log any errors and send a response indicating that the token is invalid
    console.log(error);
    res.status(404).json({ error: "¡Error al hacer la petición!" });
  }
};

export default findUsers;
