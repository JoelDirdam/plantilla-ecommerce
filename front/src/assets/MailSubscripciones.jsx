import axios from "axios";
import React, { useState } from "react";
import { URL } from "../App";
import {
  notifyErroneo,
  notifyEsperando,
  notifyExitoso,
} from "../alerts/Alerts";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";

export default function MailSubscripciones({ infoWeb }) {
  const [emails, setEmails] = useState(infoWeb[0]?.emailSubs || []);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Filtro de búsqueda
  const [link, setLink] = useState(""); // Enlace del botón
  const [subject, setSubject] = useState(""); // Asunto del email
  const [message, setMessage] = useState(""); // Mensaje del email
  const [titulo, setTitulo] = useState(""); // Mensaje del email
  const [isSending, setIsSending] = useState(false); // Estado para controlar el envío

  // Filtrar emails según el input del buscador
  const filteredEmails = emails.filter((emailObj) =>
    emailObj.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Manejar la selección de todos los emails
  const handleSelectAll = () => {
    if (selectedEmails.length === filteredEmails.length) {
      setSelectedEmails([]); // Si todos están seleccionados, desmarcar todos
    } else {
      setSelectedEmails(filteredEmails.map((emailObj) => emailObj.email)); // Seleccionar todos
    }
  };

  const handleCheckboxChange = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleEnviarEmail = async (e) => {
    e.preventDefault();

    // Validaciones
    if (selectedEmails.length === 0) {
      notifyErroneo("Debes seleccionar al menos un correo.");
      return;
    }
    if (!titulo.trim()) {
      notifyErroneo("El titulo no puede estar vacío.");
      return;
    }
    if (!subject.trim()) {
      notifyErroneo("El asunto no puede estar vacío.");
      return;
    }
    if (!message.trim()) {
      notifyErroneo("El mensaje no puede estar vacío.");
      return;
    }

    // Desactivar el botón mientras se envía el correo
    setIsSending(true);

    try {
      const response = await axios.post(`${URL}/enviar-mails-publicidad`, {
        titulo,
        emails: selectedEmails,
        subject, // Enviar el asunto
        message, // Enviar el mensaje
        link, // Enviar el enlace opcional
        token: JSON.parse(localStorage.getItem("TokenLogin")),
      });
      if (response.status === 200) {
        notifyExitoso("¡Mensaje Enviado con Éxito!");
        setSelectedEmails([]); // Limpiar selección después de enviar
        setTitulo(""); // Limpiar asunto
        setSubject(""); // Limpiar asunto
        setMessage(""); // Limpiar mensaje
        setLink(""); // Limpiar link
      } else {
        notifyEsperando("¡Error al enviar el Mensaje!");
      }
    } catch (error) {
      notifyErroneo("¡Error al enviar el Mensaje!");
      console.error(error);
    }

    // Reactivar el botón después de finalizar la petición
    setIsSending(false);
  };

  return (
    <div className="container" style={{ margin: "5rem 0" }}>
      <h1>Clientes suscriptos</h1>
      {emails && emails.length > 0 ? (
        <>
          <TextField
            label="Buscar email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSelectAll}
            style={{ marginBottom: "1rem" }}
          >
            {selectedEmails.length === filteredEmails.length
              ? "Desmarcar todos"
              : "Seleccionar todos"}
          </Button>
          <form onSubmit={handleEnviarEmail}>
            <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
              <FormGroup>
                {filteredEmails.map((emailObj) => (
                  <FormControlLabel
                    key={emailObj._id}
                    control={
                      <Checkbox
                        checked={selectedEmails.includes(emailObj.email)}
                        onChange={() => handleCheckboxChange(emailObj.email)}
                      />
                    }
                    label={emailObj.email}
                  />
                ))}
              </FormGroup>
            </div>

            {/* Input para el titulo */}
            <TextField
              label="Titulo"
              variant="outlined"
              fullWidth
              margin="normal"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            {/* Input para el Asunto */}
            <TextField
              label="Asunto"
              variant="outlined"
              fullWidth
              margin="normal"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            {/* Campo de texto para el Mensaje */}
            <TextField
              label="Escribe un mensaje"
              variant="outlined"
              fullWidth
              multiline
              rows={10} // Agranda el tamaño del input
              margin="normal"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Input para enlace */}
            <TextField
              label="Enlace (opcional)"
              variant="outlined"
              placeholder="https://www.coderplate40.com/productos"
              fullWidth
              margin="normal"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSending} // Desactivar el botón mientras se envía el correo
            >
              {isSending ? "Enviando..." : "Enviar Mail"}
            </Button>
          </form>
        </>
      ) : (
        <div style={{ margin: "1rem 0" }}>
          <p>No hay Clientes Subscriptos</p>
        </div>
      )}
    </div>
  );
}
