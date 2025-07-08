import { useState, useEffect } from "react";
import StorageUnitListAdmin from "../components/StorageUnit/StorageUnitListAdmin";
import StorageUnitForm from "../components/StorageUnit/StorageUnitForm";
import * as api from "../api/api"; // API methods for storage units

/**
 * AdminPage: Top‑level page for creating, editing, and deleting storage units.
 * It holds the list of units in state, shows/hides the form, and passes
 * data + callbacks down to child components.
 */
export default function AdminPage() {
  // Which unit is currently being edited (null = new unit)
  const [editingUnit, setEditingUnit] = useState(null);

  // Full list of storage units fetched from the backend
  const [units, setUnits] = useState([]);

  // Whether the create/edit form is visible
  const [showForm, setShowForm] = useState(false);

  /** Fetch all storage units from the API and store in state */
  async function fetchUnits() {
    try {
      const res = await api.fetchStorageUnits(); // GET /storageunits
      setUnits(res.data); // Save array of units
    } catch (e) {
      console.error("Failed to load units:", e);
    }
  }

  // Load units on first render
  useEffect(() => {
    fetchUnits();
  }, []);

  /** Called after create/update/delete to reload the list */
  const handleRefresh = () => {
    fetchUnits();
  };

  /** Open form in “edit” mode for the given unit */
  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setShowForm(true);
  };

  /** Open form in “create new” mode */
  const handleAddNew = () => {
    setEditingUnit(null);
    setShowForm(true);
  };

  /** Close the form (either cancel or after save) */
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUnit(null);
  };

  /**
   * Delete the given unit by ID, then refresh the list.
   * Prompts the user for confirmation first.
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this storage unit?")) return;
    try {
      await api.deleteStorageUnit(id); // DELETE /storageunits/{id}
      fetchUnits(); // Refresh list
    } catch (e) {
      console.error("Failed to delete unit:", e);
    }
  };

  return (
    <div>
      <h1>Admin Panel — Manage Storage Units</h1>

      {/* Button to create a new unit */}
      <button onClick={handleAddNew}>+ Add Storage Unit</button>

      {/* Conditionally show the form when needed */}
      {showForm && (
        <StorageUnitForm
          editingUnit={editingUnit} // The unit to edit, or null for new
          onClose={handleCloseForm} // Called to hide the form
          onSave={handleRefresh} // Called after save to refresh list
        />
      )}

      <hr />

      {/* The admin list of all units */}
      <StorageUnitListAdmin
        units={units} // Pass the array of storage units
        onEdit={handleEdit} // Callback when user clicks “Edit”
        onDelete={handleDelete} // Callback when user clicks “Delete”
      />
    </div>
  );
}
