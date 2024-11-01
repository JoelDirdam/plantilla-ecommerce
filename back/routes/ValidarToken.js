import jwt from "jsonwebtoken";
import User from "../models/users.js";
import dotenv from "dotenv";
dotenv.config();

export const ValidarToken = async (token) => {
  try {
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const email = decodedToken.email;
    // Find the user by email
    let user = await User.findOne({ email });

    if (!user) {
      // If the user is not found, send a response indicating that
      return false;
    }
    // Check if the email matches the admin email from environment variables
    if (user.tipoCuenta !== "Admin") {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
