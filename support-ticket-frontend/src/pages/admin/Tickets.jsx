// src/pages/admin/Tickets.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";

import { fetchTickets } from "../../services/ticketService";
import { formatDate, formatStatus } from "../../utils/formatters";
import { PRIORITIES } from "../../utils/constants";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Tickets() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationIdParam = searchParams.get("locationId");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageData, setPageData] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignment: "unassigned", // Default to unassigned
  });

  // ---------------------------------------------------------------------------
  // Load Tickets from API
  // ---------------------------------------------------------------------------
  const loadTickets = async () => {
    setLoading(true);

    try {
      const params = {
        page: pageData.page,
        size: pageData.size,
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
        unassignedOnly: filters.assignment === "unassigned",
        locationId: locationIdParam,
      };

      const data = await fetchTickets(params);

      setTickets(data.content || []);
      setPageData({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
      });
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }

    setLoading(false);
  };

  // ---------------------------------------------------------------------------
  // Fetch on page/size changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetch = async () => {
      await loadTickets();
    };
    fetch();
  }, [pageData.page, pageData.size, locationIdParam]);

  // ---------------------------------------------------------------------------
  // Fetch when filters change
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetch = async () => {
      await loadTickets();
    };
    fetch();
  }, [filters]);

  // ---------------------------------------------------------------------------
  // Search Handler
  // ---------------------------------------------------------------------------
  const handleSearch = (value, activeFilters) => {
    setFilters({
      search: value,
      status: activeFilters.status || "",
      priority: activeFilters.priority || "",
      assignment: activeFilters.assignment || "unassigned",
    });

    // Reset page but DO NOT manually reload here
    setPageData((prev) => ({ ...prev, page: 0 }));
  };

  // ---------------------------------------------------------------------------
  // Table Columns
  // ---------------------------------------------------------------------------
  const columns = [
    { label: "ID", key: "id" },
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
      label: "Priority",
      key: "priority",
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (r) => formatDate(r.createdAt),
    },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">
        All Tickets
        {locationIdParam && (
          <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            Filtering by Location ID: {locationIdParam}
          </span>
        )}
      </h1>

      <SearchBar
        placeholder="Search tickets..."
        onSearch={handleSearch}
        filters={[
          {
            key: "assignment",
            label: "View",
            type: "select",
            options: [
              { value: "unassigned", label: "Unassigned (Pending)" },
              { value: "all", label: "All Tickets" },
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "", label: "All" },
              { value: "OPEN", label: "Open" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "CLOSED", label: "Closed" },
            ],
          },
          {
            key: "priority",
            label: "Priority",
            type: "select",
            options: PRIORITIES.map((p) => ({
              value: p,
              label: p,
            })),
          },
        ]}
      />

      {loading ? (
        <p className="text-gray-600 mt-4">Loading tickets...</p>
      ) : (
        <Table columns={columns} data={tickets} />
      )}

      <Pagination
        page={pageData.page}
        size={pageData.size}
        totalElements={pageData.totalElements}
        onPageChange={(p) => setPageData((prev) => ({ ...prev, page: p }))}
        onSizeChange={(s) => setPageData((prev) => ({ ...prev, size: s }))}
      />
    </>
  );
}
