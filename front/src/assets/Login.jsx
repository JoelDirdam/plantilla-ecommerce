import React, { useState } from "react";
import "./styles/login.css";
import { URL } from "../App";
import axios from "axios";
import {
  notifyErroneo,
  notifyEsperando,
  notifyExitoso,
  timeOut,
} from "../alerts/Alerts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(`${URL}/login`, formData);
      if (response.status === 200) {
        notifyExitoso("¡Inicio de sesión existoso!");
        localStorage.setItem(
          "TokenLogin",
          JSON.stringify(response.data.TokenLogin)
        );
        timeOut("/", 1000);
      } else if (response.status === 205) {
        notifyEsperando("¡Contraseña Incorrecta! ");
      } else if (response.status === 203) {
        notifyEsperando("¡El Usuario o Mail no existe! ");
      }
    } catch (error) {
      notifyErroneo("Error al mandar la petición");
      console.error(error);
    }
  };
  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div>
          <label htmlFor="email">Email *</label>
          <input
            type="text"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contraseña">Contraseña *</label>
          <input
            type="password"
            id="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn" style={{ margin: "1rem auto" }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
