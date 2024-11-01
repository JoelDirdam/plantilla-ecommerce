import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../App";
import PedidosList from "./PedidosList";
import "./styles/pedidos.css";
export default function Pedidos({ pedidos }) {
  return (
    <div className="container-productos">
      <PedidosList pedidos={pedidos} />
    </div>
  );
}
