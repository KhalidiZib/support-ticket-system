// src/components/ui/TextArea.jsx
import React from "react";

export default function TextArea({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <textarea
        {...props}
        className={`
          w-full border rounded-lg px-3 py-2 text-sm resize-none
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }
        `}
        rows={props.rows || 4}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
