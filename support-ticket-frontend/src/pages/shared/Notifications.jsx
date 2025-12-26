import React, { useEffect, useState, useContext } from "react";
import Layout from "../../components/layout/Layout";
import { fetchMyNotifications, markNotificationRead } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import NotificationContext from "../../context/NotificationContext";
import { formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";
import { Check, Clock } from "lucide-react";

export default function Notifications() {
  const { user } = useAuth();
  const { refreshUnreadCount, decrementUnread } = useContext(NotificationContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadNotifications = async (isRefresh = false) => {
    try {
      setLoading(true);
      const data = await fetchMyNotifications({ page: isRefresh ? 0 : page, size: 20 });

      if (isRefresh) {
        setNotifications(data.content);
      } else {
        setNotifications(prev => [...prev, ...data.content]);
      }

      setHasMore(!data.last);
      if (!isRefresh && !data.last) setPage(prev => prev + 1);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(true);
  }, []); // Initial load

  const handleMarkRead = async (apiNotif) => {
    if (apiNotif.read) return;

    try {
      await markNotificationRead(apiNotif.id);

      // Update local state
      setNotifications(prev => prev.map(n =>
        n.id === apiNotif.id ? { ...n, read: true } : n
      ));

      // Update global count
      decrementUnread();

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button
          onClick={() => loadNotifications(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4 max-w-3xl">
        {notifications.length === 0 && !loading && (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">No notifications found.</p>
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleMarkRead(n)}
            className={`
              p-4 rounded-lg shadow-sm border transition-colors cursor-pointer
              ${n.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-200'}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-medium ${n.read ? 'text-gray-800' : 'text-blue-900'}`}>
                  {!n.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 mb-0.5" />}
                  {n.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1 min-w-fit ml-4">
                <Clock size={12} />
                {formatDate(n.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="text-center pt-4">
            <button
              onClick={() => setPage(p => p + 1) || loadNotifications()}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
