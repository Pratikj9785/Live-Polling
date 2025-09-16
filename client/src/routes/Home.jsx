import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section style={{ display: "grid", gap: 16, marginTop: 40 }}>
      <h3>Select Role</h3>
      <div style={{ display: "flex", gap: 16 }}>
        <Link className="btn" to="/teacher">
          Teacher
        </Link>
        <Link className="btn" to="/student">
          Student
        </Link>
      </div>
    </section>
  );
}
