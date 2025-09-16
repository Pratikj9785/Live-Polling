export function createPoll({ question, options, durationSec = 60 }) {
  const id = `${Date.now()}`;
  const deadline = Date.now() + durationSec * 1000;

  const normalizedOptions = options.map((opt, idx) => ({
    id: opt.id ?? `opt-${idx}`,
    text: opt.text,
    isCorrect: !!opt.isCorrect,
  }));

  return {
    id,
    question,
    options: normalizedOptions,
    durationSec,
    deadline,
    state: "active", // 'active' | 'closed'
    submissions: {}, // { socketId: optionId }
    results: null,   // filled on close
  };
}
