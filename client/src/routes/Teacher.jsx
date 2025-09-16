import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../services/socket.js";
import {
  setActivePoll,
  setHistory,
  setParticipants,
  setLiveCounts,
} from "../store/pollSlice.js";
import Participants from "../components/Participants.jsx";
import Results from "../components/Results.jsx";

const DURS = [30, 60, 90];

export default function Teacher() {
  const dispatch = useDispatch();
  const { activePoll, participants, history, liveCounts } = useSelector(
    (s) => s.poll
  );
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { id: "o1", text: "", isCorrect: false },
    { id: "o2", text: "", isCorrect: false },
  ]);

  useEffect(() => {
    socket.emit("session:join", { name: "Teacher", role: "teacher" });

    socket.on("poll:active", (p) => {
      dispatch(setActivePoll(p));
    });
    socket.on("poll:closed", (p) => {
      dispatch(setActivePoll(p));
    });
    socket.on("participants:update", (list) => {
      dispatch(setParticipants(list));
    });
    socket.on("poll:history", (list) => {
      dispatch(setHistory(list));
    });
    socket.on("poll:update", ({ counts }) => {
      dispatch(setLiveCounts(counts));
    });

    return () => {
      socket.off("poll:active");
      socket.off("poll:closed");
      socket.off("participants:update");
      socket.off("poll:history");
      socket.off("poll:update");
    };
  }, [dispatch]);

  const canAsk = useMemo(
    () => !activePoll || activePoll.state === "closed",
    [activePoll]
  );

  const ask = () => {
    if (!canAsk) return alert("Wait for current poll to close.");
    const filtered = options.filter((o) => o.text.trim());
    if (!question.trim() || filtered.length < 2)
      return alert("Enter question and at least two options.");
    if (!filtered.some((o) => o.isCorrect))
      return alert("Mark one option as correct.");
    const payload = {
      question: question.trim(),
      durationSec: duration,
      options: filtered,
    };
    socket.emit("poll:create", payload);
    setQuestion("");
    setOptions([
      { id: "o1", text: "", isCorrect: false },
      { id: "o2", text: "", isCorrect: false },
    ]);
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: `o${prev.length + 1}`, text: "", isCorrect: false },
    ]);
  };

  const setCorrect = (id) => {
    setOptions((prev) =>
      prev.map((o) => ({ ...o, isCorrect: o.id === id }))
    );
  };

  const kick = (id) => socket.emit("participants:kick", { targetId: id });

  return (
    <section style={{ display: "grid", gap: 16, marginTop: 16 }}>
      <h3>Ask a Question</h3>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question"
      />
      <div>
        Duration:
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          {DURS.map((d) => (
            <option key={d} value={d}>
              {d}s
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {options.map((o, idx) => (
          <div
            key={o.id}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              value={o.text}
              onChange={(e) =>
                setOptions((prev) =>
                  prev.map((p) =>
                    p.id === o.id ? { ...p, text: e.target.value } : p
                  )
                )
              }
              placeholder={`Option ${idx + 1}`}
            />
            <button
              onClick={() => setCorrect(o.id)}
              style={{ background: o.isCorrect ? "#c8f7c5" : undefined }}
            >
              Correct
            </button>
          </div>
        ))}
        <button onClick={addOption}>+ Add Option</button>
      </div>
      <button onClick={ask} disabled={!canAsk}>
        Ask Question
      </button>

      {activePoll && activePoll.state === "active" && (
        <div style={{ marginTop: 12 }}>
          <strong>Active:</strong> {activePoll.question}
          <ul>
            {activePoll.options.map((o) => (
              <li key={o.id}>
                {o.text} — {liveCounts[o.id] || 0}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activePoll && activePoll.state === "closed" && (
        <Results poll={activePoll} />
      )}

      <Participants list={participants} onKick={kick} />

      <div>
        <h4>Poll History</h4>
        <ul>
          {history.map((h) => (
            <li key={h.id}>
              {new Date(h.results?.closedAt || Date.now()).toLocaleTimeString()}{" "}
              — {h.question}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
