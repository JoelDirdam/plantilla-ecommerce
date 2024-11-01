import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// Function to handle user login
const login = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user by email or username (since both might be used for login)
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // If password matches, create a JWT token with user information
        const TokenLogin = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.SECRET_KEY
        );

        // Send the token as part of the response
        res.status(200).json({ TokenLogin });
      } else {
        // If the password does not match, send an error response
        res.status(205).json({ message: "Incorrect Password" });
      }
    } else {
      // If no user is found, send an error response indicating that the email or username does not exist
      res.status(203).json({ message: "Email or Username does not exist" });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(404).json({ error: "Error processing the request!" });
  }
};

export default login;
