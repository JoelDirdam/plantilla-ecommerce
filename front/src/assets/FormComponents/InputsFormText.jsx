import React from "react";

export default function InputsFormText({
  htmlfor,
  label,
  type,
  id,
  value,
  setText,
  textarea,
}) {
  return (
    <div>
      <label htmlFor={htmlfor}>{label}</label>
      {textarea ? (
        <textarea
          type={type}
          id={id}
          style={{ resize: "none" }}
          value={value}
          required
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          required
          onChange={(e) => setText(e.target.value)}
        />
      )}
    </div>
  );
}
