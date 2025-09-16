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
    <section className="mt-4 grid gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900">Ask a Question</h3>
        <div className="mt-4 grid gap-4">
          <div>
            <label className="mb-1 block">Question</label>
            <textarea
              className="min-h-24"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question"
            />
          </div>
          <div>
            <label className="mb-1 block">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="max-w-xs"
            >
              {DURS.map((d) => (
                <option key={d} value={d}>
                  {d}s
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3">
            <label className="mb-1 block">Options</label>
            {options.map((o, idx) => (
              <div key={o.id} className="flex items-center gap-3">
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
                  className="flex-1"
                />
                <button
                  onClick={() => setCorrect(o.id)}
                  className={`btn ${o.isCorrect ? "bg-emerald-600 hover:bg-emerald-500" : ""}`}
                >
                  Mark Correct
                </button>
              </div>
            ))}
            <div>
              <button className="btn" onClick={addOption}>+ Add Option</button>
            </div>
          </div>
          <div>
            <button className="btn" onClick={ask} disabled={!canAsk}>
              Ask Question
            </button>
          </div>
        </div>
      </div>

      {activePoll && (
        <div className="grid gap-4">
          {activePoll.state === "active" && (
            <div className="card">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-gray-900">Active</h4>
                <span className="text-xs text-gray-500">Live</span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{activePoll.question}</p>
              <ul className="mt-3 grid gap-2">
                {activePoll.options.map((o) => (
                  <li key={o.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{o.text}</span>
                    <span className="font-semibold text-gray-900">{liveCounts[o.id] || 0}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activePoll.state === "closed" && <Results poll={activePoll} />}
        </div>
      )}

      <Participants list={participants} onKick={kick} />

      <div className="card">
        <h4 className="text-base font-semibold text-gray-900">Poll History</h4>
        <ul className="mt-2 grid gap-1 text-sm text-gray-700">
          {history.map((h) => (
            <li key={h.id} className="flex items-center justify-between">
              <span>{h.question}</span>
              <span className="text-gray-500">{new Date(h.results?.closedAt || Date.now()).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
