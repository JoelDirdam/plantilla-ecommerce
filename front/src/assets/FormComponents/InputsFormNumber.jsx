import React from "react";

export default function InputsFormNumber({
  htmlfor,
  label,
  type,
  id,
  value,
  setNumber,
  span,
  required,
}) {
  return (
    <div>
      <label htmlFor={htmlfor}>{label}</label>
      <div>
        {required ? (
          <input
            type={type}
            id={id}
            value={value}
            required
            onChange={(e) => setNumber(Number(e.target.value))}
          />
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            onChange={(e) => setNumber(Number(e.target.value))}
          />
        )}
        <span>{span}</span>
      </div>
    </div>
  );
}
