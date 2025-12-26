import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import StatCard from "../../components/ui/StatCard";
import { fetchAgentDashboard } from "../../services/dashboardService";
import { Ticket, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function AgentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAgentDashboard();
      setStats(data);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Agent Dashboard</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : !stats ? (
        <p className="text-red-500">Failed to load agent statistics.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Assigned Tickets"
            value={stats.assignedTickets || 0}
            icon={<Ticket size={22} />}
          />
          <StatCard
            label="Open"
            value={stats.openTickets || 0}
            icon={<AlertTriangle size={22} />}
          />
          <StatCard
            label="In Progress"
            value={stats.inProgressTickets || 0}
            icon={<Clock size={22} />}
          />
          <StatCard
            label="Resolved"
            value={stats.resolvedTickets || 0}
            icon={<CheckCircle size={22} />}
          />
        </div>
      )}
    </>
  );
}
