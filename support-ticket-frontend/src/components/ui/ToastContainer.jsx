// src/components/ui/ToastContainer.jsx
import React, { useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

export default function ToastContainer({ toasts, removeToast }) {
  useEffect(() => {
    // Auto-remove each toast after 4 seconds
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 4000)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [toasts, removeToast]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={22} className="text-green-500" />;
      case "error":
        return <AlertTriangle size={22} className="text-red-500" />;
      case "info":
        return <Info size={22} className="text-blue-500" />;
      case "warning":
        return <AlertTriangle size={22} className="text-yellow-500" />;
      default:
        return <Info size={22} className="text-gray-500" />;
    }
  };

  const getBackground = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-300";
      case "error":
        return "bg-red-50 border-red-300";
      case "info":
        return "bg-blue-50 border-blue-300";
      case "warning":
        return "bg-yellow-50 border-yellow-300";
      default:
        return "bg-gray-50 border-gray-300";
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center shadow-lg rounded-lg border px-4 py-3 w-80
            transition-all duration-300 animate-slide-in 
            ${getBackground(toast.type)}
          `}
        >
          <div className="mr-3">{getIcon(toast.type)}</div>

          <div className="flex-1">
            <p className="font-semibold text-gray-800">{toast.title}</p>
            {toast.message && (
              <p className="text-sm text-gray-600">{toast.message}</p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
