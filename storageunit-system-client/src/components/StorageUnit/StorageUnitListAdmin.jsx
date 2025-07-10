import { useState, useEffect } from "react";
import { fetchStorageUnits, deleteStorageUnit } from "../../api/api"; // Fetch and delete API
import StorageUnitForm from "./StorageUnitForm"; // Form for editing/creating
import useNotify from "../Notification/useNotify"; // Toast notifications

export default function StorageUnitListAdmin() {
  // State variable to store the list of storage units
  const [storageUnits, setStorageUnits] = useState([]);

  // State variable to track loading status
  const [loading, setLoading] = useState(true);

  // State variable to track which field to sort by
  const [sortKey, setSortKey] = useState("name");

  // State variable to hold the currently editing storage unit (for modal)
  const [editingUnit, setEditingUnit] = useState(null);

  // My Notify Alerts
  const notify = useNotify();

  // Fetch all storage units when the component mounts
  useEffect(() => {
    fetchStorageUnits()
      .then((res) => {
        setStorageUnits(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching storage units:", err);
        notify.error("Failed to fetch storage units.");
        setLoading(false);
      });
  }, []);

  // Sort units dynamically based on selected key
  const sortedUnits = [...storageUnits].sort((a, b) => {
    switch (sortKey) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return a.pricePerMonth - b.pricePerMonth;
      case "size":
        return a.sizeInM2 - b.sizeInM2;
      case "availability":
        return b.available === a.available ? 0 : b.available ? 1 : -1;
      default:
        return 0;
    }
  });

  // Refresh the list after create/update/delete
  async function refreshList() {
    try {
      const response = await fetchStorageUnits();
      setStorageUnits(response.data);
      setEditingUnit(null);
    } catch (err) {
      notify.error("Failed to refresh storage units.");
    }
  }

  // Trigger edit modal
  function handleEdit(unit) {
    setEditingUnit(unit);
  }

  // Handle delete with confirmation
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      await deleteStorageUnit(id);
      notify.success("Deleted successfully.");
      refreshList();
    } catch (err) {
      notify.error("Failed to delete unit.");
    }
  }

  // Handle modal close
  function handleClose() {
    setEditingUnit(null);
  }

  // Render loading or empty state
  if (loading) return <p>Loading storage units...</p>;
  if (!storageUnits.length) return <p>No storage units available.</p>;

  return (
    <div>
      <h2>Admin Storage Unit Management</h2>

      {/* Sort dropdown */}
      <label htmlFor="sort-select" style={{ marginRight: "0.5rem" }}>
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        <option value="name">Name (A-Z)</option>
        <option value="price">Price (Low to High)</option>
        <option value="size">Size (Small to Large)</option>
        <option value="availability">Availability</option>
      </select>

      {/* List of storage unit cards */}
      <div className="storage-unit-list">
        {sortedUnits.map((unit) => (
          <div
            key={unit.id}
            className="storage-unit-card"
            style={{
              cursor: "default",
              position: "relative",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "10px",
              marginBottom: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <strong>{unit.name}</strong>
            <p>Size: {unit.sizeInM2} m²</p>
            <p>Price: ${unit.pricePerMonth}/month</p>
            <p>
              Status:{" "}
              <span
                style={{
                  color: unit.available ? "#4CAF50" : "#f44336",
                  fontWeight: "bold",
                }}
              >
                {unit.available ? "Available" : "Not Available"}
              </span>
            </p>

            {/* Edit & Delete buttons */}
            <div style={{ marginTop: "1rem" }}>
              <button onClick={() => handleEdit(unit)}>Edit</button>
              <button onClick={() => handleDelete(unit.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for edit/create */}
      {editingUnit && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <StorageUnitForm
              editingUnit={editingUnit}
              onClose={handleClose}
              onSave={refreshList}
            />
          </div>
        </div>
      )}
    </div>
  );
}
