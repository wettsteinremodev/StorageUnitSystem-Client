import { useState, useEffect } from "react";
import RentingList from "../components/Rentings/RentingList";
import RentingForm from "../components/Rentings/RentingForm";
import * as api from "../api/api";

/**
 * RentingPage
 * - Manages rentings: create, edit, delete
 * - Displays renting form and list side by side
 */
export default function RentingPage() {
  // Currently selected renting for editing
  const [editingRenting, setEditingRenting] = useState(null);

  // List of all rentings from the backend
  const [rentings, setRentings] = useState([]);

  /** Fetch all rentings from API */
  async function fetchRentings() {
    try {
      const response = await api.fetchRentings();
      setRentings(response.data);
    } catch (error) {
      console.error("Failed to fetch rentings:", error);
    }
  }

  // Fetch rentings on first render
  useEffect(() => {
    fetchRentings();
  }, []);

  /** Refresh list after create/update/delete */
  const handleRefresh = () => {
    fetchRentings();
  };

  /** Open form with selected renting for editing */
  const handleEdit = (renting) => {
    setEditingRenting(renting);
  };

  /** Close form (after save or cancel) */
  const handleFormClose = () => {
    setEditingRenting();
  };

  /** Delete a renting with confirmation, then refresh list */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this renting?")) return;

    try {
      await api.deleteRentings(id);
      handleRefresh();
    } catch (error) {
      console.error("Failed to delete renting:", error);
    }
  };

  return (
    <div>
      <h1>Renting Management</h1>

      <div className="two-column-layout">
        {/* Right panel: Form to create or edit a renting */}
        <div className="right-panel">
          <RentingForm
            editingRenting={editingRenting}
            onClose={handleFormClose}
            onSave={handleRefresh}
          />
        </div>

        {/* Left panel: List of existing rentings */}
        <div className="left-panel">
          <RentingList
            rentings={rentings}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
