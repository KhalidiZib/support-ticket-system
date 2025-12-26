import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);


  // ---------------------------------------------------------------------
  // Load categories
  // ---------------------------------------------------------------------
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
    setLoading(false);
  };

  // ---------------------------------------------------------------------
  // Fetch on first render (safe pattern)
  // ---------------------------------------------------------------------
  useEffect(() => {
    const fetch = async () => {
      await loadCategories();
    };
    fetch();
  }, []);

  // ---------------------------------------------------------------------
  // Save (create or update)
  // ---------------------------------------------------------------------
  const handleSave = async () => {
    if (editing) {
      await updateCategory(editing.id, { name: categoryName });
    } else {
      await createCategory({ name: categoryName });
    }

    setIsModalOpen(false);
    setEditing(null);
    setCategoryName("");

    await loadCategories();
  };

  // ---------------------------------------------------------------------
  // Delete Logic
  // ---------------------------------------------------------------------
  const confirmDelete = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category. It may be in use by existing tickets.");
      setIsDeleteModalOpen(false);
    }
  };


  // ---------------------------------------------------------------------
  // Table Columns
  // ---------------------------------------------------------------------
  const columns = [
    { label: "Category", key: "name" },
    {
      label: "Actions",
      key: "actions",
      render: (cat) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditing(cat);
              setCategoryName(cat.name);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => confirmDelete(cat)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Categories</h1>

        <Button
          onClick={() => {
            setEditing(null);
            setCategoryName("");
            setIsModalOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading categories...</p>
      ) : (
        <Table columns={columns} data={categories} />
      )}

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
        footer={
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save
          </Button>
        }
      >
        <input
          type="text"
          placeholder="Category name"
          className="border p-2 w-full"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <Button variant="danger" size="sm" onClick={handleDeleteCategory}>
            Delete
          </Button>
        }
      >
        <p>Delete category "<strong>{categoryToDelete?.name}</strong>"?</p>
      </Modal>
    </>
  );
}
