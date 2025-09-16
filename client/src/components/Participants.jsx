import React from "react";

export default function Participants({ list, onKick }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h4>Participants</h4>
      <ul>
        {list.map((p) => (
          <li
            key={p.id}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <span>
              {p.name} <small>({p.role})</small>
            </span>
            {p.role === "student" && onKick && (
              <button onClick={() => onKick(p.id)}>Kick</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
