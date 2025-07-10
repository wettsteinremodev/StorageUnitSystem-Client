import { useState, useEffect } from "react";
import RenForm from "../components/Rentings/RenForm";
import RentingList from "../components/Rentings/RentingList";

export default function RentingPage() {
  const [rentings, setRentings] = useState([]);
  const [editingRenting, setEditingRenting] = useState(null);

  // Fetch all rentings
  const fetchRentings = async () => {
    try {
      const res = await api.fetchRentings();
      setRentings(res.data);
    } catch (e) {
      console.error("Fetch rentings error:", e);
    }
  };

  useEffect(() => {
    fetchRentings();
  }, []);

  const handleEdit = (r) => setEditingRenting(r);
  const handleCloseForm = () => setEditingRenting(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this renting?")) return;
    try {
      await api.deleteRentings(id);
      fetchRentings();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const handleSave = () => {
    fetchRentings();
    setEditingRenting(null);
  };

  return (
    <div>
      <h1>Renting Management</h1>

      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <RentingList
            rentings={rentings}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div style={{ flex: 1 }}>
          <RenForm
            editingRenting={editingRenting}
            onClose={handleCloseForm}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
