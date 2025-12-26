// src/components/ui/Input.jsx
import React from "react";

export default function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}

        <input
          {...props}
          className={`
            w-full border rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-2
            ${icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }
          `}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
