// src/components/ui/EmptyState.jsx
import React from "react";
import { Search } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters.",
  icon = <Search size={40} className="text-gray-400" />,
  actionLabel,
  onAction,
  className = ""
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center p-10 
        bg-white border border-gray-200 rounded-lg shadow-sm
        ${className}
      `}
    >
      <div className="mb-4">{icon}</div>

      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>

      <p className="text-gray-500 mt-2 mb-6">{description}</p>

      {actionLabel && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
