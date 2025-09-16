import React from "react";
import { useSelector } from "react-redux";

export default function Results({ poll }) {
  const { liveCounts } = useSelector((s) => s.poll);

  if (!poll) return null;

  // --- If poll is active, show live counts ---
  if (poll.state === "active") {
    const total = Object.values(liveCounts || {}).reduce((a, b) => a + b, 0);
    return (
      <div style={{ marginTop: 16 }}>
        <h4>Live Results</h4>
        <ul>
          {poll.options.map((o) => {
            const n = liveCounts[o.id] || 0;
            const pct = total ? Math.round((n / total) * 100) : 0;
            return (
              <li key={o.id} style={{ listStyle: "none", margin: "6px 0" }}>
                {o.text} — {n} votes ({pct}%)
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
      <div style={{ marginTop: 16 }}>
        <h4>Final Results</h4>
        <ul>
          {poll.options.map((o) => {
            const n = poll.results.counts[o.id] || 0;
            const pct = total ? Math.round((n / total) * 100) : 0;
            const isCorrect = poll.results.correctOptionId === o.id;
            return (
              <li key={o.id} style={{ listStyle: "none", margin: "6px 0" }}>
                <span style={{ fontWeight: isCorrect ? "bold" : "normal" }}>
                  {o.text}
                </span>{" "}
                — {n} votes ({pct}%) {isCorrect ? "✓" : ""}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return null;
}
