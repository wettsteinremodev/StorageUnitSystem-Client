import { useState, useEffect } from "react";
import RentingList from "../components/Rentings/RentingList";
import RentingForm from "../components/Rentings/RentingForm";
import * as api from "../api/api";

// Main page component for managing rentings
export default function RentingPage() {
  // Track which renting is currently being edited; null means new renting
  const [editingRenting, setEditingRenting] = useState(null);

  // State holding the list of all rentings fetched from backend
  const [rentings, setRentings] = useState([]);

  // Fetch all rentings from backend API
  async function fetchRentings() {
    try {
      const response = await api.fetchRentings(); // API call to get rentings
      setRentings(response.data); // Update state with fetched rentings
    } catch (error) {
      console.error("Failed to fetch rentings:", error); // Log errors
    }
  }

  // Load rentings once on component mount
  useEffect(() => {
    fetchRentings();
  }, []);

  // Refresh handler called after create/update/delete to reload rentings
  const handleRefresh = () => {
    fetchRentings();
  };

  // Open form with selected renting for editing
  const handleEdit = (renting) => {
    setEditingRenting(renting);
  };

  // Close form, cancel editing or after save
  const handleFormClose = () => {
    setEditingRenting(null);
  };

  // Delete renting by id with confirmation and refresh list
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this renting?"))
      return;

    try {
      await api.deleteRentings(id); // API call to delete renting
      handleRefresh(); // Refresh the list after delete
    } catch (error) {
      console.error("Failed to delete renting:", error);
      // Optionally notify user here about the error
    }
  };

  return (
    <div>
      <h1>Renting Management</h1>

      {/* Layout with two side-by-side panels */}
      <div className="two-column-layout">
        {/* Right panel: renting form for adding or editing */}
        <div className="right-panel">
          <RentingForm
            editingRenting={editingRenting} // Renting being edited, or null
            onClose={handleFormClose} // Close form callback
            onSave={handleRefresh} // Refresh list after save
          />
        </div>

        {/* Left panel: list of rentings */}
        <div className="left-panel">
          <RentingList
            rentings={rentings} // Pass current rentings as prop
            onEdit={handleEdit} // Edit renting callback
            onDelete={handleDelete} // Delete renting callback
          />
        </div>
      </div>
    </div>
  );
}
