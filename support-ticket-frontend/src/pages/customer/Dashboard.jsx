import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import StatCard from "../../components/ui/StatCard";
import Table from "../../components/ui/Table";
import { fetchCustomerDashboard } from "../../services/dashboardService";
import { formatDate, formatStatus } from "../../utils/formatters";
import { Ticket, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCustomerDashboard();
        setStats(data.stats);
        setRecentTickets(data.recentTickets || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = [
    {
      label: "Title",
      key: "title",
      render: (row) => (
        <span
          className="text-blue-600 hover:underline cursor-pointer"
          onClick={() => navigate(`/tickets/${row.id}`)}
        >
          {row.title}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (r) => formatStatus(r.status),
    },
    {
      label: "Created",
      key: "createdAt",
      render: (r) => formatDate(r.createdAt),
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">My Dashboard</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          {/* STATS */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total Tickets"
                value={stats.totalTickets}
                icon={<Ticket size={22} />}
              />
              <StatCard
                label="Open"
                value={stats.openTickets}
                icon={<AlertTriangle size={22} />}
              />
              <StatCard
                label="In Progress"
                value={stats.inProgressTickets}
                icon={<Clock size={22} />}
              />
              <StatCard
                label="Resolved"
                value={stats.resolvedTickets}
                icon={<CheckCircle size={22} />}
              />
            </div>
          )}

          {/* RECENT TICKETS */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Recent Tickets</h2>
              <button
                onClick={() => navigate("/customer/tickets")}
                className="text-sm text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>
            {recentTickets.length === 0 ? (
              <p className="text-gray-500 text-sm">No tickets yet.</p>
            ) : (
              <Table columns={columns} data={recentTickets} />
            )}
          </div>
        </>
      )}
    </>
  );
}
