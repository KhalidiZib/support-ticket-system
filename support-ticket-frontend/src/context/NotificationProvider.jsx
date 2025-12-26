import React, { useState, useCallback, useEffect } from "react";
import NotificationContext from "./NotificationContext";
import { fetchUnreadCount } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";

export default function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch (e) {
      console.error("Failed to fetch notification count", e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshUnreadCount();
      // Poll every 30s
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [user, refreshUnreadCount]);

  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-remove toast
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const api = {
    toasts,
    addToast,
    // Toast helpers
    success: (msg) => addToast("success", msg),
    error: (msg) => addToast("error", msg),
    info: (msg) => addToast("info", msg),
    // Persistent notifications
    unreadCount,
    decrementUnread: () => setUnreadCount(prev => Math.max(0, prev - 1)),
    clearUnread: () => setUnreadCount(0),
    refreshUnreadCount
  };

  return (
    <NotificationContext.Provider value={api}>
      {children}

      {/* Toast UI */}
      <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded shadow text-sm text-white animate-slide-in pointer-events-auto
              ${toast.type === "success" ? "bg-green-600" : ""}
              ${toast.type === "error" ? "bg-red-600" : ""}
              ${toast.type === "info" ? "bg-blue-600" : ""}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
