import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import { fetchUsers } from "../../services/userService";
import { formatRole } from "../../utils/formatters";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pageData, setPageData] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
  });

  // ------------------------------------------------------------------
  // Load agents
  // ------------------------------------------------------------------
  const loadAgents = async () => {
    try {
      const params = { page: pageData.page, size: pageData.size, role: "AGENT" };
      const data = await fetchUsers(params);

      const content = Array.isArray(data) ? data : (data.content || []);
      setAgents(content);

      setPageData({
        page: data.page || 0,
        size: data.size || content.length,
        totalElements: data.totalElements || content.length,
      });
    } catch (error) {
      console.error("Failed to load agents:", error);
    }
    setLoading(false);
  };

  // ------------------------------------------------------------------
  // Safe effect (no direct state-changing async calls)
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetch = async () => {
      await loadAgents();
    };
    fetch();
  }, [pageData.page, pageData.size]);

  // ------------------------------------------------------------------
  // Columns
  // ------------------------------------------------------------------
  const columns = [
    {
      label: "Name",
      key: "name",
      render: (u) => (
        <Link
          to={`/admin/users/${u.id}`}
          className="text-primary-600 hover:text-primary-800 hover:underline font-medium"
        >
          {u.name}
        </Link>
      )
    },
    { label: "Email", key: "email" },
    { label: "Role", key: "role", render: (u) => formatRole(u.role) },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Agents</h1>
        <Link
          to="/admin/agents/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Agent
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading agents...</p>
      ) : (
        <>
          <Table columns={columns} data={agents} />

          <Pagination
            page={pageData.page}
            size={pageData.size}
            totalElements={pageData.totalElements}
            onPageChange={(p) => setPageData({ ...pageData, page: p })}
            onSizeChange={(s) => setPageData({ ...pageData, size: s })}
          />
        </>
      )}
    </>
  );
}
