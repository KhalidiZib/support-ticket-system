// src/components/ui/Tag.jsx
import React from "react";

export default function Tag({ status }) {
  const styles = {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`
        px-2 py-1 text-xs font-semibold rounded-md
        ${styles[status] || "bg-gray-100 text-gray-600"}
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
}
