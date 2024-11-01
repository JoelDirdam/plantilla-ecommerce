import jwt from "jsonwebtoken";
import User from "../models/users.js";
import dotenv from "dotenv";
dotenv.config();
// Function to handle user profile retrieval
const perfil = async (req, res) => {
  // Extract the token from the Authorization header (format: "Bearer token")
  const token = req.headers.authorization.split(" ")[1];

  try {
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const email = decodedToken.email;

    // Find the user by email
    let user = await User.findOne({ email });

    if (!user) {
      // If the user is not found, send a response indicating that
      return res.status(205).json({ message: "User Not Found" });
    }

    // Check if the email matches the admin email from environment variables
    if (email === process.env.EMAIL_ADMIN && user.tipoCuenta !== "Admin") {
      // Update the user to have "Admin" account type
      user.tipoCuenta = "Admin";
      await user.save(); // Save the updated user in the database
    }

    // Send the user data as the response, now possibly with updated admin rights
    return res.status(200).json(user);
  } catch (error) {
    // Log any errors and send a response indicating that the token is invalid
    console.log(error);
    return res.status(404).json({ error: "Invalid Token!" });
  }
};

export default perfil;
