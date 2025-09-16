import { useEffect, useState } from "react";
import React from "react";

export default function Countdown({ deadline }) {
  const [ms, setMs] = useState(Math.max(0, deadline - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setMs(Math.max(0, deadline - Date.now())), 200);
    return () => clearInterval(t);
  }, [deadline]);
  const s = Math.ceil(ms / 1000);
  return <div>Time left: {s}s</div>;
}
