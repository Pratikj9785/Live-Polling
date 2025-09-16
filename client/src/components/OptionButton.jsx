import React from "react";

export default function OptionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {children}
    </button>
  );
}
