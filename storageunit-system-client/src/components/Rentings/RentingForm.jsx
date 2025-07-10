import { useState, useEffect } from "react";
import * as api from "../../api/api";
import useNotify from "../Notification/useNotify";

export default function RentingForm({ editingRenting, onClose, onSave }) {
  // Form state variables for user, storage unit, dates
  const [userId, setUserId] = useState("");
  const [storageUnitId, setStorageUnitId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dropdown lists for users and storage units
  const [users, setUsers] = useState([]);
  const [storageUnits, setStorageUnits] = useState([]);

  // Tracking Validation ERRORS
  const [errors, setErrors] = useState({});

  // My Notify Alerts
  const notify = useNotify();

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
      notify.error("Failed to load users: " + error.message);
    }
  }

  // Fetch storage units from API
  async function fetchStorageUnits() {
    try {
      const response = await api.fetchStorageUnits();
      setStorageUnits(response.data);
    } catch (error) {
      notify.error("Failed to load storage units: " + error.message);
    }
  }

  // Validation
  function validate() {
    const newErrors = {};

    if (!userId) newErrors.userId = "Please select a user.";
    if (!storageUnitId) newErrors.storageUnitId = "Please select a storage unit.";
    if (!startDate) newErrors.startDate = "Please enter a start date.";
    if (!endDate) newErrors.endDate = "Please enter an end date.";

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime())) newErrors.startDate = "Start date is invalid.";
      if (isNaN(end.getTime())) newErrors.endDate = "End date is invalid.";
      if (!newErrors.startDate && !newErrors.endDate && start > end) {
        newErrors.date = "Start date must be before end date.";
      }
    }
    setErrors(newErrors);
    return newErrors; 
  }

  // Handle form submission to create or update renting
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation of inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      notify.warning("Check:\n" + errorMessages);
      return;
    }

    // Construct renting object matching backend format
    const rentingData = {
      startDate,
      endDate,
      user: { id: Number(userId) },
      storageUnit: { id: Number(storageUnitId) },
    };

    try {
      if (editingRenting) {
        // Update existing renting
        await api.updateRentings(editingRenting.id, rentingData);
        notify.success("Renting updated successfully.");
      } else {
        // Create new renting
        console.log("Renting Data to submit:", rentingData);
        await api.createRentings(rentingData);
        notify.success("Renting created successfully.");
      }

      onSave(); // Trigger parent refresh

      onClose(); // Trigger parent component to close form
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        const errorMessages = Object.values(errors).join("\n");
        notify.error(errorMessages);
      } else {
        notify.error("Error saving renting: " + error.message);
      }
    }
  }

  return (
    <div>
      <h2>{editingRenting ? "Edit Renting" : "Add New Renting"}</h2>

      <form className="storage-unit-form" onSubmit={handleSubmit}>
        <div>
          <label>
            User:
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.userName}
                </option>
              ))}
            </select>
          </label>
          {errors.userId && <p className="form-error">{errors.userId}</p>}
        </div>

        <div>
          <label>
            Storage Unit:
            <select
              value={storageUnitId}
              onChange={(e) => setStorageUnitId(e.target.value)}
            >
              <option value="">Select storage unit</option>
              {storageUnits
                .filter((unit) => unit.available)
                .map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.sizeInM2} m²) - ${unit.pricePerMonth}
                  </option>
                ))}
            </select>
          </label>
          {errors.storageUnitId && (
            <p className="form-error">{errors.storageUnitId}</p>
          )}
        </div>

        <div>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          {errors.startDate && <p className="form-error">{errors.startDate}</p>}
        </div>

        <div>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          {errors.endDate && <p className="form-error">{errors.endDate}</p>}
        </div>

        {errors.date && <p className="form-error">{errors.date}</p>}

        <button type="submit">{editingRenting ? "Update" : "Create"}</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}
