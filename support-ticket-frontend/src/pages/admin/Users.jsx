// src/pages/admin/Users.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

import { fetchUsers, createUser, toggleUserEnabled, deleteUser } from "../../services/userService";
import { formatRole } from "../../utils/formatters";
import { ROLES } from "../../utils/constants";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageData, setPageData] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    role: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "CUSTOMER",
  });

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // ---------------------------------------------------------------------------
  // Load Users
  // ---------------------------------------------------------------------------
  const loadUsers = async () => {
    setLoading(true);

    try {
      const params = {
        page: pageData.page,
        size: pageData.size,
        search: filters.search,
        role: filters.role,
      };

      const data = await fetchUsers(params);

      setUsers(data.content || []);
      setPageData({
        page: typeof data.number === 'number' ? data.number : data.page,
        size: data.size,
        totalElements: data.totalElements,
      });
    } catch (err) {
      console.error("Failed to load users:", err);
    }

    setLoading(false);
  };

  // Fetch whenever page or size changes
  useEffect(() => {
    const fetch = async () => {
      await loadUsers();
    };
    fetch();
  }, [pageData.page, pageData.size]);

  // ---------------------------------------------------------------------------
  // Search Handler
  // ---------------------------------------------------------------------------
  const handleSearch = (value, activeFilters) => {
    setFilters({
      search: value,
      role: activeFilters.role || "",
    });

    setPageData((prev) => ({ ...prev, page: 0 }));
  };

  // Refresh when filters change
  useEffect(() => {
    const fetch = async () => {
      await loadUsers();
    };
    fetch();
  }, [filters]);

  // ---------------------------------------------------------------------------
  // Create New User
  // ---------------------------------------------------------------------------
  const handleCreateUser = async () => {
    await createUser(newUser);
    setIsModalOpen(false);
    loadUsers();
  };

  // ---------------------------------------------------------------------------
  // Enable / Disable User
  // ---------------------------------------------------------------------------
  const handleToggleActive = async (id, currentState) => {
    await toggleUserEnabled(id, !currentState);
    loadUsers();
  };

  // ---------------------------------------------------------------------------
  // Delete User Logic
  // ---------------------------------------------------------------------------
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      await loadUsers(); // Refresh list
    } catch (error) {
      alert("Failed to delete user. They may be assigned to active tickets.");
      console.error(error);
      setIsDeleteModalOpen(false);
    }
  };


  // ---------------------------------------------------------------------------
  // Table Columns
  // ---------------------------------------------------------------------------
  const columns = [
    { label: "ID", key: "id" },
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
    {
      label: "Role",
      key: "role",
      render: (u) => formatRole(u.role),
    },
    {
      label: "Enabled",
      key: "enabled",
      render: (u) =>
        u.enabled ? (
          <span className="text-green-600 font-medium">Active</span>
        ) : (
          <span className="text-red-500 font-medium">Disabled</span>
        ),
    },
    {
      label: "Actions",
      key: "actions",
      render: (u) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={u.enabled ? "danger" : "primary"}
            onClick={() => handleToggleActive(u.id, u.enabled)}
          >
            {u.enabled ? "Disable" : "Enable"}
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => confirmDelete(u)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create User</Button>
      </div>

      <SearchBar
        placeholder="Search users..."
        onSearch={handleSearch}
        filters={[
          {
            key: "role",
            label: "Role",
            type: "select",
            options: Object.values(ROLES).map((r) => ({ value: r, label: r })),
          },
        ]}
      />

      {loading ? (
        <p className="text-gray-500 mt-4">Loading users...</p>
      ) : (
        <Table columns={columns} data={users} />
      )}

      <Pagination
        page={pageData.page}
        size={pageData.size}
        totalElements={pageData.totalElements}
        onPageChange={(p) => setPageData((prev) => ({ ...prev, page: p }))}
        onSizeChange={(s) => setPageData((prev) => ({ ...prev, size: s }))}
      />

      {/* Create User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New User"
        footer={
          <Button onClick={handleCreateUser} variant="primary" size="sm">
            Save User
          </Button>
        }
      >
        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-2"
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="border p-2 w-full mb-2"
          onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />

        <select
          className="border p-2 w-full"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          {Object.values(ROLES).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <Button variant="danger" size="sm" onClick={handleDeleteUser}>
            Delete
          </Button>
        }
      >
        <p>
          Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
