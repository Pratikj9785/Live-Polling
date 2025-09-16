import React from "react";

export default function Participants({ list, onKick }) {
  return (
    <div className="card">
      <h4 className="text-base font-semibold text-gray-900">Participants</h4>
      <ul className="mt-2 divide-y divide-gray-200">
        {list.map((p) => (
          <li key={p.id} className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-800">
              {p.name} <span className="text-gray-500">({p.role})</span>
            </span>
            {p.role === "student" && onKick && (
              <button className="btn px-3 py-1 text-xs" onClick={() => onKick(p.id)}>Kick</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
