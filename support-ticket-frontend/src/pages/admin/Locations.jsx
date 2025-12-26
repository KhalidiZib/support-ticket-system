import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import { fetchLocationsPaginated, createLocation, deleteLocation, fetchLocationsByType } from "../../services/locationService";

const LOCATION_TYPES = ["PROVINCE", "DISTRICT", "SECTOR", "CELL", "VILLAGE"];

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    type: "PROVINCE",
    parentId: "",
  });

  // Parent Options State
  const [parentOptions, setParentOptions] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  // ---------------------------------------------------------------------------
  // Load Locations
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Load Locations
  // ---------------------------------------------------------------------------
  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await fetchLocationsPaginated(page, size);
      setLocations(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Failed to load locations:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLocations();
  }, [page, size]);

  // ---------------------------------------------------------------------------
  // Dynamic Parent Loading logic
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Determine required parent type
    let requiredParentType = null;
    switch (newLocation.type) {
      case "DISTRICT": requiredParentType = "PROVINCE"; break;
      case "SECTOR": requiredParentType = "DISTRICT"; break;
      case "CELL": requiredParentType = "SECTOR"; break;
      case "VILLAGE": requiredParentType = "CELL"; break;
      default: requiredParentType = null;
    }

    if (requiredParentType) {
      setLoadingParents(true);
      fetchLocationsByType(requiredParentType)
        .then(data => setParentOptions(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingParents(false));
    } else {
      setParentOptions([]);
    }
  }, [newLocation.type]);

  // ---------------------------------------------------------------------------
  // Create Handler
  // ---------------------------------------------------------------------------
  const handleCreate = async () => {
    try {
      await createLocation({
        name: newLocation.name,
        type: newLocation.type,
        parentId: newLocation.parentId ? parseInt(newLocation.parentId) : null
      });
      setIsModalOpen(false);
      setNewLocation({ name: "", type: "PROVINCE", parentId: "" }); // Reset
      loadLocations();
    } catch (err) {
      alert("Failed to create location.");
      console.error(err);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete Logic
  // ---------------------------------------------------------------------------
  const confirmDelete = (loc) => {
    setLocationToDelete(loc);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;
    try {
      await deleteLocation(locationToDelete.id);
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
      loadLocations();
    } catch (err) {
      alert("Failed to delete. It may have child locations relying on it.");
      console.error(err);
      setIsDeleteModalOpen(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Table columns
  // ---------------------------------------------------------------------------
  const columns = [
    { label: "Name", key: "name" },
    { label: "Type", key: "type" },
    { label: "Parent", key: "parentName", render: (l) => l.parentName || "-" }, // Assuming DTO has parentName, otherwise "-"
    {
      label: "Actions",
      key: "actions",
      render: (l) => (
        <Button size="sm" variant="danger" onClick={() => confirmDelete(l)}>
          Delete
        </Button>
      )
    },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Locations</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Location</Button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading locations...</p>
      ) : (
        <>
          <Table columns={columns} data={locations} />
          {locations.length > 0 && (
            <div className="mt-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                size={size}
                onSizeChange={(newSize) => {
                  setSize(newSize);
                  setPage(0); // Reset to first page
                }}
                totalElements={totalElements}
              />
            </div>
          )}
        </>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Location"
        footer={
          <Button onClick={handleCreate}>Save Location</Button>
        }
      >
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="e.g. Northern Province"
              value={newLocation.name}
              onChange={e => setNewLocation({ ...newLocation, name: e.target.value })}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border p-2 rounded"
              value={newLocation.type}
              onChange={e => setNewLocation({ ...newLocation, type: e.target.value, parentId: "" })}
            >
              {LOCATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Parent Select (Conditional) */}
          {newLocation.type !== "PROVINCE" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Parent ({loadingParents ? "Loading..." : "Select One"})
              </label>
              <select
                className="w-full border p-2 rounded"
                value={newLocation.parentId}
                onChange={e => setNewLocation({ ...newLocation, parentId: e.target.value })}
              >
                <option value="">-- Select Parent --</option>
                {parentOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

        </div>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        }
      >
        <p>Are you sure you want to delete <strong>{locationToDelete?.name}</strong>?</p>
        <p className="text-sm text-red-500 mt-2">
          Warning: If this location has children (e.g. a Province with Districts),
          deleting it might fail or cascade.
        </p>
      </Modal>
    </>
  );
}
