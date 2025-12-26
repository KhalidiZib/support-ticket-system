// src/components/ui/Select.jsx
import React from "react";

export default function Select({
  label,
  error,
  options = [],
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <select
        {...props}
        className={`
          w-full border rounded-lg px-3 py-2 text-sm
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
