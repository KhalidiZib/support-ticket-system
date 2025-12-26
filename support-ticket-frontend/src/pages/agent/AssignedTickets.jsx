// src/pages/agent/AssignedTickets.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

import {
  fetchAssignedTickets,
  updateTicketStatus,
} from "../../services/ticketService";

import { formatDate, formatStatus } from "../../utils/formatters";

import { useAuth } from "../../context/AuthContext";

export default function AssignedTickets() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
  });

  // Modal state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // ----------------------------------------------------------
  // LOAD TICKETS
  // ----------------------------------------------------------
  const loadTickets = async () => {
    setLoading(true);

    try {
      const params = {
        page: pageData.page,
        size: pageData.size,
        search: filters.search,
        status: filters.status,
      };

      const data = await fetchAssignedTickets(params);

      setTickets(data.content || []);
      setPageData({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
      });
    } catch (e) {
      console.error("Failed to fetch tickets:", e);
    }

    setLoading(false);
  };

  // Run when page or size changes
  useEffect(() => {
    const fetch = async () => {
      await loadTickets();
    };
    fetch();
  }, [pageData.page, pageData.size]);

  // ----------------------------------------------------------
  // SEARCH HANDLER
  // ----------------------------------------------------------
  const handleSearch = (value, activeFilters) => {
    setFilters({
      search: value,
      status: activeFilters.status || "",
    });

    // Reset to page 0 → triggers effect → reloads tickets
    setPageData((prev) => ({ ...prev, page: 0 }));
  };

  // ----------------------------------------------------------
  // UPDATE STATUS
  // ----------------------------------------------------------
  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;

    await updateTicketStatus(selectedTicket.id, newStatus);

    setSelectedTicket(null);
    setNewStatus("");

    loadTickets();
  };

  // ----------------------------------------------------------
  // TABLE COLUMNS
  // ----------------------------------------------------------
  const columns = [
    { label: "ID", key: "id" },
    {
      label: "Title",
      key: "title",
      render: (row) => (
        <span
          onClick={() => navigate(`/tickets/${row.id}`)}
          className="text-blue-600 hover:underline cursor-pointer"
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
    {
      label: "Actions",
      key: "actions",
      render: (ticket) => (
        <Button
          size="sm"
          onClick={() => {
            setSelectedTicket(ticket);
            setNewStatus(ticket.status);
          }}
        >
          Update Status
        </Button>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">My Assigned Tickets</h1>

      {/* SEARCH BAR */}
      <SearchBar
        placeholder="Search your tickets..."
        onSearch={handleSearch}
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "", label: "All" },
              { value: "OPEN", label: "Open" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "RESOLVED", label: "Resolved" },
            ],
          },
        ]}
      />

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-500 mt-4">Loading tickets...</p>
      ) : (
        <Table columns={columns} data={tickets} />
      )}

      {/* PAGINATION */}
      <Pagination
        page={pageData.page}
        size={pageData.size}
        totalElements={pageData.totalElements}
        onPageChange={(p) => setPageData((prev) => ({ ...prev, page: p }))}
        onSizeChange={(s) => setPageData((prev) => ({ ...prev, size: s }))}
      />

      {/* STATUS MODAL */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Update Ticket Status"
        footer={
          <Button variant="primary" onClick={handleUpdateStatus}>
            Save
          </Button>
        }
      >
        {selectedTicket && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Updating status for <span className="font-semibold text-slate-900">{selectedTicket.title}</span>
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">New Status</label>
              <select
                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 block p-2.5 outline-none transition-all"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
