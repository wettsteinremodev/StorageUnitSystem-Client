// RentingPage.jsx - main page for managing rentings

import { useState } from "react";
import RentingList from "../components/Rentings/RentingList";
import RentingForm from "../components/Rentings/RentingForm";

export default function RentingPage() {
  // Track which renting is currently being edited; null means new renting
  const [editingRenting, setEditingRenting] = useState(null);

  // Open form with renting to edit
  const handleEdit = (renting) => {
    setEditingRenting(renting);
  };

  // Close the form (cancel editing or after save)
  const handleFormClose = () => {
    setEditingRenting(null);
  };

  return (
    <div className="two-column-layout">
      <h1>Renting Management</h1>
      <div className="right-panel">
        {/* Renting form to add or edit rentings */}
        <RentingForm
          editingRenting={editingRenting}
          onClose={handleFormClose}
        />
      </div>
      <div className="left-panel">
        {/* List of rentings with edit/delete support */}
        <RentingList onEdit={handleEdit} />
      </div>
    </div>
  );
}
