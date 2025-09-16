import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import "./index.css";
import App from "./App.jsx";
import Home from "./routes/Home.jsx";
import Teacher from "./routes/Teacher.jsx";
import Student from "./routes/Student.jsx";
import Question from "./routes/Question.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="teacher" element={<Teacher />} />
            <Route path="student" element={<Student />} />
            <Route path="student/question" element={<Question />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
