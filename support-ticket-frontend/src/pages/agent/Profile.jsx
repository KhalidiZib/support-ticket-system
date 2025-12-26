import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import { getMyProfile, updateMyProfile } from "../../services/userService";

export default function Profile() {
  const [_profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getMyProfile();
      setProfile(data);
      setEditData({ name: data.name, phone: data.phoneNumber });
      setLoading(false);
    };

    load();
  }, []);

  const handleSave = async () => {
    await updateMyProfile(editData);
    alert("Profile updated!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">My Profile</h1>

      <div className="bg-white p-6 shadow rounded-lg max-w-lg">
        <label className="block mb-2 font-medium">Name</label>
        <input
          type="text"
          className="border p-2 w-full mb-3"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />

        <label className="block mb-2 font-medium">Phone Number</label>
        <input
          type="text"
          className="border p-2 w-full mb-3"
          value={editData.phone}
          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
        />

        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </>
  );
}
