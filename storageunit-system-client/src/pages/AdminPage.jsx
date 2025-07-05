// src/pages/AdminPage.jsx

import { useState, useEffect } from "react";

// Import components for listing and form
import StorageUnitListAdmin from "../components/StorageUnit/StorageUnitListAdmin";
import StorageUnitForm from "../components/StorageUnit/StorageUnitForm";

// Main Admin page for managing storage units
export default function AdminPage() {
  // State to hold the unit currently being edited (null means create new)
  const [editingUnit, setEditingUnit] = useState(null);

  // When clicking "Edit" on a unit, this function sets it to editing
  const handleEdit = (unit) => {
    setEditingUnit(unit);
  };

  return (
    <div>
      <h1>Admin Panel - Manage Storage Units</h1>
      <hr />

      {/* Pass handleEdit to list to enable editing from list */}
      <StorageUnitListAdmin onEdit={handleEdit} />
    </div>
  );
}
