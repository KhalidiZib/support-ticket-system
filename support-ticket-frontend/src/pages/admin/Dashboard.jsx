import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import StatCard from "../../components/ui/StatCard";
import { fetchAdminDashboard } from "../../services/dashboardService";
import { Ticket, Users, Folder, MapPin } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminDashboard();
        setStats(data);
      } catch (e) {
        console.error("Dashboard Error:", e);
      }
      setLoading(false);
    };

    loadStats();
  }, []);

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Admin Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading statistics...</p>
      ) : !stats ? (
        <p className="text-red-500">Failed to load statistics.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Tickets"
            value={stats.totalTickets || 0}
            icon={<Ticket size={22} />}
          />

          <StatCard
            label="Open Tickets"
            value={stats.openTickets || 0}
            icon={<Ticket size={22} />}
            trend="+3%"
          />

          <StatCard
            label="Registered Users"
            value={stats.totalUsers || 0}
            icon={<Users size={22} />}
          />

          <StatCard
            label="Categories"
            value={stats.totalCategories || 0}
            icon={<Folder size={22} />}
          />
        </div>
      )}
    </>
  );
}
