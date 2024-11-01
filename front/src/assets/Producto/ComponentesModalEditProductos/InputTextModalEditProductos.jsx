import React from "react";

export default function InputTextModalEditProductos({
  htmlfor,
  text,
  type,
  id,
  value,
  setFunction,
  textarea,
}) {
  return (
    <div>
      <label htmlFor={htmlfor}>{text}</label>
      {textarea ? (
        <textarea
          type={type}
          id={id}
          value={value}
          style={{ resize: "none" }}
          required
          onChange={(e) => setFunction(e.target.value)}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          required
          onChange={(e) => setFunction(e.target.value)}
        />
      )}
    </div>
  );
}
