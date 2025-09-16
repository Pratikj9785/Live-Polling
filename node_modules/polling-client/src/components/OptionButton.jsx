import React from "react";

export default function OptionButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 12px" }}>
      {children}
    </button>
  );
}
