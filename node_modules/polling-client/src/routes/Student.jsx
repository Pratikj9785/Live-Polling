import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket.js";
import { setMe } from "../store/pollSlice.js";

function ensureTabUniqueName(base) {
  const key = "lp_name";
  let name = sessionStorage.getItem(key);
  if (!name) {
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    name = `${base || "Student"}-${suffix}`;
    sessionStorage.setItem(key, name);
  }
  return name;
}

export default function Student() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = sessionStorage.getItem("lp_name");
    if (saved) setInput(saved);
  }, []);

  const onContinue = () => {
    const name = ensureTabUniqueName(input.trim() || "Student");
    sessionStorage.setItem("lp_name", name);
    dispatch(setMe({ name, role: "student" }));
    console.log("Sending session:join", name);
    socket.emit("session:join", { name, role: "student" });
    navigate("/student/question");
  };

  return (
    <section className="mt-8 grid place-items-center">
      <div className="card w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900">Enter Name</h3>
        <div className="mt-3 grid gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Your name" />
          <button className="btn" onClick={onContinue}>Continue</button>
        </div>
      </div>
    </section>
  );
}
