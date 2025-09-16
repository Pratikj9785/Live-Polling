import React from "react";
import { useSelector } from "react-redux";

export default function Results({ poll }) {
  const { liveCounts } = useSelector((s) => s.poll);

  if (!poll) return null;

  // --- If poll is active, show live counts ---
  if (poll.state === "active") {
    const total = Object.values(liveCounts || {}).reduce((a, b) => a + b, 0);
    return (
      <div className="card">
        <h4 className="text-base font-semibold text-gray-900">Live Results</h4>
        <ul className="mt-2 grid gap-2">
          {poll.options.map((o) => {
            const n = liveCounts[o.id] || 0;
            const pct = total ? Math.round((n / total) * 100) : 0;
            return (
              <li key={o.id} className="text-sm text-gray-800">
                <div className="mb-1 flex items-center justify-between">
                  <span>{o.text}</span>
                  <span className="font-semibold">{n} ({pct}%)</span>
                </div>
                <div className="progress">
                  <div className="bar" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // --- If poll is closed, show final results with correct answer ---
  if (poll.state === "closed" && poll.results) {
    const total = Object.values(poll.results.counts).reduce(
      (a, b) => a + b,
      0
    );
    return (
      <div className="card">
        <h4 className="text-base font-semibold text-gray-900">Final Results</h4>
        <ul className="mt-2 grid gap-2">
          {poll.options.map((o) => {
            const n = poll.results.counts[o.id] || 0;
            const pct = total ? Math.round((n / total) * 100) : 0;
            const isCorrect = poll.results.correctOptionId === o.id;
            return (
              <li key={o.id} className="text-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className={`font-medium ${isCorrect ? "text-emerald-700" : "text-gray-800"}`}>
                    {o.text} {isCorrect ? "✓" : ""}
                  </span>
                  <span className="font-semibold text-gray-900">{n} ({pct}%)</span>
                </div>
                <div className="progress">
                  <div className={`bar ${isCorrect ? "bg-emerald-600" : "bg-indigo-600"}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return null;
}
