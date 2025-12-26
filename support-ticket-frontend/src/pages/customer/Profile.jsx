import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import { getMyProfile, updateMyProfile } from "../../services/userService";

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getMyProfile();
      setProfile(data);
      setEditData({
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
      });
    };
    load();
  }, []);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile(editData);
      alert("Profile updated");
    } catch (e) {
      console.error(e);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-lg">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="text"
            className="border p-2 rounded w-full bg-gray-100"
            value={profile.email}
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="border p-2 rounded w-full"
            value={editData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            className="border p-2 rounded w-full"
            value={editData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  );
}
