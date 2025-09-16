import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../services/socket.js";
import {
  setActivePoll,
  setHistory,
  markAnswered,
  setLiveCounts,
} from "../store/pollSlice.js";
import Countdown from "../components/Countdown.jsx";
import OptionButton from "../components/OptionButton.jsx";
import Results from "../components/Results.jsx";

export default function Question() {
  const dispatch = useDispatch();
  const { activePoll, answered, liveCounts } = useSelector((s) => s.poll);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    function onActive(poll) {
      dispatch(setActivePoll(poll));
      setWaiting(false);
    }
    function onClosed(poll) {
      dispatch(setActivePoll(poll));
    }
    function onHistory(list) {
      dispatch(setHistory(list));
    }
    function onUpdate({ counts }) {
      dispatch(setLiveCounts(counts));
    }

    socket.on("poll:active", onActive);
    socket.on("poll:closed", onClosed);
    socket.on("poll:history", onHistory);
    socket.on("poll:update", onUpdate);

    const name = sessionStorage.getItem("lp_name") || "Student";
    socket.emit("session:join", { name, role: "student" });

    return () => {
      socket.off("poll:active", onActive);
      socket.off("poll:closed", onClosed);
      socket.off("poll:history", onHistory);
      socket.off("poll:update", onUpdate);
    };
  }, [dispatch]);

  const remainingMs = useMemo(
    () => (activePoll ? Math.max(0, activePoll.deadline - Date.now()) : 0),
    [activePoll]
  );

  const choose = (optionId) => {
    socket.emit("poll:answer", { optionId });
    dispatch(markAnswered());
  };

  if (waiting && !activePoll)
    return (
      <div className="mt-6 rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
        Waiting for teacher to ask a question…
      </div>
    );

  if (!activePoll)
    return (
      <div className="mt-6 rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
        No active question.
      </div>
    );

  const isClosed = activePoll.state === "closed";

  return (
    <section className="mt-6 grid gap-4">
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{activePoll.question}</h3>
          {!isClosed && <Countdown deadline={activePoll.deadline} />}
        </div>

        {!isClosed && !answered && (
          <div className="mt-4 grid gap-2">
            {activePoll.options.map((o) => (
              <OptionButton key={o.id} onClick={() => choose(o.id)}>
                {o.text}
              </OptionButton>
            ))}
          </div>
        )}

        {!isClosed && answered && (
          <div className="mt-3">
            <p className="text-sm text-gray-700">Answer submitted. Watching live results…</p>
            <ul className="mt-2 grid gap-2">
              {activePoll.options.map((o) => (
                <li key={o.id} className="text-sm text-gray-800">
                  <div className="mb-1 flex items-center justify-between">
                    <span>{o.text}</span>
                    <span className="font-semibold">{liveCounts[o.id] || 0}</span>
                  </div>
                  <div className="progress">
                    <div
                      className="bar"
                      style={{ width: `${Math.min(100, Math.round(((liveCounts[o.id] || 0) / Math.max(1, Object.values(liveCounts || {}).reduce((a,b)=>a+b,0))) * 100))}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isClosed && <Results poll={activePoll} />}
      </div>
    </section>
  );
}
