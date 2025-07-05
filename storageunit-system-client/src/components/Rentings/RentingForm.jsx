import { useState, useEffect } from "react";
import * as api from "../../api/api";

export default function RentingForm({ editingRenting, onClose }) {
  // Form state variables for user, storage unit, dates
  const [userId, setUserId] = useState("");
  const [storageUnitId, setStorageUnitId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dropdown lists for users and storage units
  const [users, setUsers] = useState([]);
  const [storageUnits, setStorageUnits] = useState([]);

  // Load users and storage units on component mount
  useEffect(() => {
    fetchUsers();
    fetchStorageUnits();
  }, []);

  // Populate form fields if editing an existing renting
  useEffect(() => {
    if (editingRenting) {
      setUserId(editingRenting.user.id);
      setStorageUnitId(editingRenting.storageUnit.id);
      setStartDate(editingRenting.startDate);
      setEndDate(editingRenting.endDate);
    } else {
      // Reset form fields for new renting
      setUserId("");
      setStorageUnitId("");
      setStartDate("");
      setEndDate("");
    }
  }, [editingRenting]);

  // Fetch users from API
  async function fetchUsers() {
    try {
      const response = await api.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      alert("Failed to load users: " + error.message);
    }
  }

  // Fetch storage units from API
  async function fetchStorageUnits() {
    try {
      const response = await api.fetchStorageUnits();
      setStorageUnits(response.data);
    } catch (error) {
      alert("Failed to load storage units: " + error.message);
    }
  }

  // Handle form submission to create or update renting
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation of inputs
    if (!userId || !storageUnitId || !startDate || !endDate) {
      alert("Please fill in all fields.");
      return;
    }

    // Construct renting object matching backend format
    const rentingData = {
      user: { id: userId },
      storageUnit: { id: storageUnitId },
      startDate,
      endDate,
    };

    try {
      if (editingRenting) {
        // Update existing renting
        await api.updateRentings(editingRenting.id, rentingData);
        alert("Renting updated successfully.");
      } else {
        // Create new renting
        await api.createRentings(rentingData);
        alert("Renting created successfully.");
      }
      onClose(); // Close the form modal or panel after success
    } catch (error) {
      alert("Failed to save renting: " + error.message);
    }
  }

  return (
    <div className="form-wrapper">
      <h2>{editingRenting ? "Edit Renting" : "Add New Renting"}</h2>

      <form className="storage-unit-form" onSubmit={handleSubmit}>
        <div>
          <label>
            User:{" "}
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.userName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Storage Unit:{" "}
            <select
              value={storageUnitId}
              onChange={(e) => setStorageUnitId(e.target.value)}
              required
            >
              <option value="">Select storage unit</option>
              {storageUnits
                .filter((unit) => unit.available) // Only show available units
                .map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.sizeInM2} m²) - ${unit.pricePerMonth}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Start Date:{" "}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            End Date:{" "}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit">{editingRenting ? "Update" : "Create"}</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}
