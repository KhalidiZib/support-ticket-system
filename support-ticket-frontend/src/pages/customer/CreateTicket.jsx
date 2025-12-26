import React, { useState, useEffect } from "react";
import { createTicket } from "../../services/ticketService";
import { fetchCategories } from "../../services/categoryService";
import { fetchTopLevelLocations, fetchLocationsByParent } from "../../services/locationService";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function CreateTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("LOW");

  // Cascading Location State
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedCell, setSelectedCell] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  // Load initial data (Categories + Provinces)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, provs] = await Promise.all([
          fetchCategories(),
          fetchTopLevelLocations(),
        ]);
        setCategories(Array.isArray(cats) ? cats : (cats.content || []));
        setProvinces(provs || []);
      } catch (e) {
        console.error("Failed to load metadata", e);
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, []);

  // Handle Province Change -> Load Districts
  const handleProvinceChange = async (e) => {
    const val = e.target.value;
    setSelectedProvince(val);
    setSelectedDistrict("");
    setSelectedSector("");
    setSelectedCell("");
    setSelectedVillage("");
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);

    if (val) {
      try {
        const data = await fetchLocationsByParent(val);
        setDistricts(data);
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    }
  };

  // Handle District Change -> Load Sectors
  const handleDistrictChange = async (e) => {
    const val = e.target.value;
    setSelectedDistrict(val);
    setSelectedSector("");
    setSelectedCell("");
    setSelectedVillage("");
    setSectors([]);
    setCells([]);
    setVillages([]);

    if (val) {
      try {
        const data = await fetchLocationsByParent(val);
        setSectors(data);
      } catch (err) {
        console.error("Failed to load sectors", err);
      }
    }
  };

  // Handle Sector Change -> Load Cells
  const handleSectorChange = async (e) => {
    const val = e.target.value;
    setSelectedSector(val);
    setSelectedCell("");
    setSelectedVillage("");
    setCells([]);
    setVillages([]);

    if (val) {
      try {
        const data = await fetchLocationsByParent(val);
        setCells(data);
      } catch (err) {
        console.error("Failed to load cells", err);
      }
    }
  };

  // Handle Cell Change -> Load Villages
  const handleCellChange = async (e) => {
    const val = e.target.value;
    setSelectedCell(val);
    setSelectedVillage("");
    setVillages([]);

    if (val) {
      try {
        const data = await fetchLocationsByParent(val);
        setVillages(data);
      } catch (err) {
        console.error("Failed to load villages", err);
      }
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // The final location ID is the most specific one selected (Village)
    // You could also allow "selectedCell" if villages are optional, but assuming full hierarchy is needed:
    const finalLocationId = selectedVillage;

    if (!finalLocationId) {
      setMessage("Please select a location down to the Village level.");
      setLoading(false);
      return;
    }

    try {
      await createTicket({
        title,
        description,
        categoryId: parseInt(categoryId),
        locationId: parseInt(finalLocationId),
        priority,
      });

      setMessage("Ticket created successfully!");
      setTimeout(() => {
        navigate("/customer/tickets"); // Redirect to My Tickets
      }, 1500);
    } catch {
      setMessage("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <p className="p-6">Loading options...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Ticket</h1>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Short summary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            placeholder="Explain the issue..."
          ></textarea>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Category</label>
          <select
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* CASCADING LOCATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Province */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Province</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
              value={selectedProvince}
              onChange={handleProvinceChange}
              required
            >
              <option value="">Select Province</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">District</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedProvince}
              required
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Sector */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Sector</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
              value={selectedSector}
              onChange={handleSectorChange}
              disabled={!selectedDistrict}
              required
            >
              <option value="">Select Sector</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Cell */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Cell</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
              value={selectedCell}
              onChange={handleCellChange}
              disabled={!selectedSector}
              required
            >
              <option value="">Select Cell</option>
              {cells.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Village */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Village</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              disabled={!selectedCell}
              required
            >
              <option value="">Select Village</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Priority */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Priority</label>
          <select
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating..." : "Create Ticket"}
        </Button>
      </form>
    </div>
  );
}
