import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import { fetchMyTickets } from "../../services/ticketService";
import { formatDate, formatStatus } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";

export default function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [pageData, setPageData] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const params = {
        page: pageData.page,
        size: pageData.size,
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
      };

      const data = await fetchMyTickets(params);
      setTickets(data.content);
      setPageData({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData.page, pageData.size]);

  const handleSearch = (value, activeFilters) => {
    const updatedFilters = {
      search: value,
      status: activeFilters.status || "",
      priority: activeFilters.priority || "",
    };
    setFilters(updatedFilters);
    setPageData((prev) => ({ ...prev, page: 0 }));
    // Reload immediately
    setTimeout(loadTickets, 0);
  };

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
      label: "Category",
      key: "category",
      render: (r) => r.category?.name || "-",
    },
    {
      label: "Status",
      key: "status",
      render: (r) => formatStatus(r.status),
    },
    {
      label: "Priority",
      key: "priority",
      render: (r) => r.priority,
    },
    {
      label: "Created",
      key: "createdAt",
      render: (r) => formatDate(r.createdAt),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Tickets</h1>
        <button
          onClick={() => navigate("/customer/create-ticket")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          + New Ticket
        </button>
      </div>

      <SearchBar
        placeholder="Search by title, description..."
        onSearch={handleSearch}
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
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
            options: [
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
              { value: "URGENT", label: "Urgent" },
            ],
          },
        ]}
      />

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          <Table columns={columns} data={tickets} />
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
