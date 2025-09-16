import { useEffect, useState } from "react";
import React from "react";

export default function Countdown({ deadline }) {
  const [ms, setMs] = useState(Math.max(0, deadline - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setMs(Math.max(0, deadline - Date.now())), 200);
    return () => clearInterval(t);
  }, [deadline]);
  const s = Math.ceil(ms / 1000);
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
      <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
      Time left: {s}s
    </div>
  );
}
