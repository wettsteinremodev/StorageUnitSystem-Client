import { useState, useEffect } from "react"; // Import hooks for state and lifecycle
import { fetchStorageUnits } from "../../api/api"; // Import the API method to fetch storage units
import StorageUnitForm from "./StorageUnitForm"; // Import the form component to edit/create units

export default function StorageUnitList() {
  // State variable to store the list of storage units
  const [storageUnits, setStorageUnits] = useState([]);

  // State variable to track loading status
  const [loading, setLoading] = useState(true);

  // State variable to track which field to sort by
  const [sortKey, setSortKey] = useState("name"); // Default sort by name

  // State variable to hold the currently editing storage unit (for modal)
  const [editingUnit, setEditingUnit] = useState(null);

  // useEffect runs once when the component is mounted to fetch storage units
  useEffect(() => {
    fetchStorageUnits()
      .then((response) => {
        setStorageUnits(response.data); // Update the state with fetched data
        setLoading(false); // Loading complete
      })
      .catch((error) => {
        console.error("Error fetching storage units:", error);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs only once on mount

  // Sort storageUnits array based on the current sortKey
  const sortedUnits = [...storageUnits].sort((a, b) => {
    if (sortKey === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortKey === "price") {
      return a.pricePerMonth - b.pricePerMonth;
    } else if (sortKey === "size") {
      return a.sizeInM2 - b.sizeInM2;
    } else if (sortKey === "availability") {
      // Sort so available units come first
      return b.available === a.available ? 0 : b.available ? 1 : -1;
    }
    return 0;
  });

  // Show loading message while fetching data
  if (loading) {
    return <p>Loading storage units...</p>;
  }

  // Show message if there are no storage units available
  if (storageUnits.length === 0) {
    return <p>No storage units available.</p>;
  }

  // Handle clicking a storage unit card to open the edit form modal
  function handleCardClick(unit) {
    setEditingUnit(unit);
  }

  // Refresh the storage units list from the backend (called after saving changes)
  async function refreshList() {
    try {
      const response = await fetchStorageUnits();
      setStorageUnits(response.data);
      setEditingUnit(null); // Close the modal after refreshing
    } catch (err) {
      alert("Failed to refresh storage units: " + err.message);
    }
  }

  // Close the editing modal without refreshing
  function handleClose() {
    setEditingUnit(null);
  }

  // Render the main list with sorting dropdown and cards
  return (
    <div>
      <h2>Storage Units</h2>

      {/* Sorting dropdown */}
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
            onClick={() => handleCardClick(unit)} // Open modal on click
            style={{ cursor: "pointer" }}
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
          </div>
        ))}
      </div>

      {/* Modal popup for editing the storage unit */}
      {editingUnit && (
        <div className="modal-backdrop">
          <div className="modal-content">
            {/* StorageUnitForm handles editing and updating */}
            <StorageUnitForm
              editingUnit={editingUnit}
              onClose={() => {
                handleClose(); // Close modal
                refreshList(); // Refresh list after saving changes
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
