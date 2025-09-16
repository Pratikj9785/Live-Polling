import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  me: { name: null, role: null },
  activePoll: null,
  history: [],
  participants: [],
  progress: 0,
  answered: false,
  liveCounts: {}, // 👈 new
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setMe(state, action) {
      state.me = action.payload;
    },
    setActivePoll(state, action) {
      state.activePoll = action.payload;
      state.answered = false;
      state.progress = 0;
      state.liveCounts = {}; // reset counts on new poll
    },
    setHistory(state, action) {
      state.history = action.payload;
    },
    setParticipants(state, action) {
      state.participants = action.payload;
    },
    setProgress(state, action) {
      state.progress = action.payload;
    },
    markAnswered(state) {
      state.answered = true;
    },
    setLiveCounts(state, action) {
      state.liveCounts = action.payload;
    },
    clear(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setMe,
  setActivePoll,
  setHistory,
  setParticipants,
  setProgress,
  markAnswered,
  setLiveCounts,
  clear,
} = pollSlice.actions;

export default pollSlice.reducer;
