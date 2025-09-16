import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="mx-auto max-w-5xl p-4">
      <header className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Live Poll</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100" to="/">Home</Link>
          <Link className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100" to="/teacher">Teacher</Link>
          <Link className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100" to="/student">Student</Link>
        </nav>
      </header>
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <footer className="mt-8 text-center text-xs text-gray-500">Built with React, Redux, and Socket.io</footer>
    </div>
  );
}
