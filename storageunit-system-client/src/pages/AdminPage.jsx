import { useState, useEffect } from "react";
import StorageUnitListAdmin from "../components/StorageUnit/StorageUnitListAdmin";
import StorageUnitForm from "../components/StorageUnit/StorageUnitForm";
import * as api from "../api/api";

/**
 * AdminPage
 * - Manages CRUD operations for storage units
 * - Displays a list and handles create/edit/delete through the form
 */
export default function AdminPage() {

    // Currently selected units for editing
  const [editingUnit, setEditingUnit] = useState(null); 

  // List of all rentings from the backend
  const [units, setUnits] = useState([]); 

  // Show/hide form
  const [showForm, setShowForm] = useState(false);

  /** Fetch storage units from backend */
  const fetchUnits = async () => {
    try {
      const res = await api.fetchStorageUnits(); // GET /storageunits
      setUnits(res.data);
    } catch (e) {
      console.error("Failed to load units:", e);
    }
  };

  // Load units when component mounts
  useEffect(() => {
    fetchUnits();
  }, []);

  // Refresh the list after update/create/delete
  const handleRefresh = () => fetchUnits();

  // Open form to edit an existing unit
  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setShowForm(true);
  };

  // Open form to create a new unit
  const handleAddNew = () => {
    setEditingUnit();
    setShowForm(true);
  };

  // Close the form
  const handleCloseForm = () => {
    setEditingUnit(null);
    setShowForm(false);
  };

  // Delete a unit after confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this storage unit?")) return;
    try {
      await api.deleteStorageUnit(id); // DELETE /storageunits/{id}
      fetchUnits();
    } catch (e) {
      console.error("Failed to delete unit:", e);
    }
  };

  return (
    <div>
      <h1>Admin Panel — Manage Storage Units</h1>

      {/* Button to create a new unit */}
      <button onClick={handleAddNew}>+ Add Storage Unit</button>

      {/* Conditionally render the create/edit form */}
      {showForm && (
        <StorageUnitForm
          editingUnit={editingUnit}
          onClose={handleCloseForm}
          onSave={handleRefresh}
        />
      )}

      <hr />

      {/* List of existing storage units */}
      <StorageUnitListAdmin
        units={units}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
