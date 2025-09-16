// socket.js
import { Server } from "socket.io";
import { createPoll } from "./models.js";

export function initSocket(httpServer, corsOrigin = "*") {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
      credentials: false,
    },
    transports: ["websocket", "polling"],
    allowUpgrades: true,
    pingInterval: 20000,
    pingTimeout: 25000,
  });

  // ---- Global State ----
  const participants = new Map(); // socket.id -> { name, role }
  let activePoll = null;
  const pollHistory = [];

  // Log connection transport
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id, "via", socket.conn.transport.name);
  });

  // ---- Helpers ----
  function broadcastParticipants() {
    const list = [...participants.entries()].map(([id, info]) => ({
      id,
      ...info,
    }));
    console.log("Broadcast participants:", list);
    io.emit("participants:update", list);
  }

  function closePoll(reason = "time") {
    if (!activePoll || activePoll.state !== "active") return;

    const counts = {};
    activePoll.options.forEach((o) => (counts[o.id] = 0));
    Object.values(activePoll.submissions).forEach((optId) => {
      if (counts[optId] != null) counts[optId] += 1;
    });
    const correct = activePoll.options.find((o) => o.isCorrect)?.id ?? null;

    activePoll.state = "closed";
    activePoll.closedAt = Date.now();
    activePoll.reason = reason;
    activePoll.results = {
      counts,
      correctOptionId: correct,
      closedAt: activePoll.closedAt,
      reason,
    };

    console.log("Poll closed:", activePoll.question, activePoll.results);
    pollHistory.unshift(activePoll);
    io.emit("poll:closed", activePoll);

    activePoll = null;
  }

  function maybeEarlyClose() {
    if (!activePoll) return;
    const totalStudents = [...participants.values()].filter(
      (p) => p.role === "student"
    ).length;
    const answered = Object.keys(activePoll.submissions).length;

    if (totalStudents > 0 && answered >= totalStudents) {
      closePoll("all-answered");
    }
  }

  setInterval(() => {
    if (activePoll && Date.now() >= activePoll.deadline) {
      closePoll("timeout");
    }
  }, 300);

  // ---- Socket Events ----
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("session:join", ({ name, role }) => {
      console.log("Join event:", socket.id, name, role);
      participants.set(socket.id, { name, role });
      broadcastParticipants();

      if (activePoll) socket.emit("poll:active", activePoll);
      socket.emit("poll:history", pollHistory.slice(0, 20));
    });

    socket.on("poll:create", (payload) => {
      const actor = participants.get(socket.id);
      if (!actor || actor.role !== "teacher") return;

      if (activePoll) {
        socket.emit("error:message", "A poll is already active.");
        return;
      }

      const poll = createPoll(payload);
      activePoll = poll;
      console.log("Poll created:", poll.question);
      io.emit("poll:active", poll);
    });

    socket.on("poll:answer", ({ optionId }) => {
      if (!activePoll || activePoll.state !== "active") return;
      const actor = participants.get(socket.id);
      if (!actor || actor.role !== "student") return;

      if (Date.now() > activePoll.deadline) return;

      activePoll.submissions[socket.id] = optionId;

      // Tally current votes
      const counts = {};
      activePoll.options.forEach((o) => (counts[o.id] = 0));
      Object.values(activePoll.submissions).forEach((optId) => {
        if (counts[optId] != null) counts[optId] += 1;
      });

      io.to(socket.id).emit("poll:answer:ack", { ok: true });
      // Broadcast live counts to everyone
      io.emit("poll:update", { counts });

      maybeEarlyClose();

    });

    socket.on("poll:close", () => {
      const actor = participants.get(socket.id);
      if (!actor || actor.role !== "teacher") return;
      console.log("Poll closed early by teacher");
      closePoll("teacher-close");
    });

    socket.on("participants:kick", ({ targetId }) => {
      const actor = participants.get(socket.id);
      if (!actor || actor.role !== "teacher") return;

      const target = io.sockets.sockets.get(targetId);
      if (target) {
        console.log("Kicked participant:", targetId);
        target.disconnect(true);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      participants.delete(socket.id);
      broadcastParticipants();
    });
  });

  return io;
}
