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
      <p style={{ marginTop: 24 }}>Waiting for teacher to ask a question…</p>
    );

  if (!activePoll) return <p style={{ marginTop: 24 }}>No active question.</p>;

  const isClosed = activePoll.state === "closed";

  return (
    <section style={{ marginTop: 24 }}>
      <h3>{activePoll.question}</h3>
      {!isClosed && <Countdown deadline={activePoll.deadline} />}

      {!isClosed && !answered && (
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {activePoll.options.map((o) => (
            <OptionButton key={o.id} onClick={() => choose(o.id)}>
              {o.text}
            </OptionButton>
          ))}
        </div>
      )}

      {!isClosed && answered && (
        <div>
          <p>Answer submitted. Watching live results…</p>
          <ul>
            {activePoll.options.map((o) => (
              <li key={o.id}>
                {o.text} — {liveCounts[o.id] || 0}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isClosed && <Results poll={activePoll} />}
    </section>
  );
}
