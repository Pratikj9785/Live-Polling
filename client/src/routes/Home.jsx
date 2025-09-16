import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="mt-10 grid gap-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Select Your Role</h2>
        <p className="mt-2 text-sm text-gray-600">Choose how you want to participate in the live poll.</p>
      </div>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Link to="/teacher" className="card group flex flex-col items-start justify-between p-6 transition hover:shadow-md">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Teacher</h3>
            <p className="mt-1 text-sm text-gray-600">Create questions, see live results, and manage participants.</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </span>
        </Link>
        <Link to="/student" className="card group flex flex-col items-start justify-between p-6 transition hover:shadow-md">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Student</h3>
            <p className="mt-1 text-sm text-gray-600">Join a session, answer questions, and watch results live.</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
