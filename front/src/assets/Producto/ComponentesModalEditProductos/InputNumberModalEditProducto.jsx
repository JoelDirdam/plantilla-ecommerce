import React from "react";

export default function InputNumberModalEditProducto({
  htmlfor,
  text,
  type,
  id,
  value,
  setFunction,
  requiredState,
  span,
}) {
  return (
    <div>
      <label htmlFor={htmlfor}>{text}</label>
      <div>
        {requiredState ? (
          <input
            type={type}
            id={id}
            value={value}
            required
            min="0"
            onChange={(e) => setFunction(Number(e.target.value))}
          />
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            min="0"
            onChange={(e) => setFunction(Number(e.target.value))}
          />
        )}
        <span>
          <strong> {span}</strong>
        </span>
      </div>
    </div>
  );
}
