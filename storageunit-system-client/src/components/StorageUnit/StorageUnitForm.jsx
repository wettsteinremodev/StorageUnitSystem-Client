// src/components/StorageUnits/StorageUnitForm.jsx

import { useState, useEffect } from "react";
import * as api from "../../api/api"; // API functions for create/update

// Form component to create or update a storage unit
export default function StorageUnitForm({ editingUnit, onClose }) {
  // Form fields state, initialized empty or with editingUnit data
  const [name, setName] = useState("");
  const [sizeInM2, setSizeInM2] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [available, setAvailable] = useState(true);

  // Effect to update form fields when editingUnit changes
  useEffect(() => {
    if (editingUnit) {
      setName(editingUnit.name);
      setSizeInM2(editingUnit.sizeInM2);
      setPricePerMonth(editingUnit.pricePerMonth);
      setAvailable(editingUnit.available);
    } else {
      // Clear form when not editing
      setName("");
      setSizeInM2("");
      setPricePerMonth("");
      setAvailable(true);
    }
  }, [editingUnit]);

  // Handle form submission for create or update
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation could be added here
    if (!name || !sizeInM2 || !pricePerMonth) {
      alert("Please fill in all required fields.");
      return;
    }

    // Construct storage unit object from form state
    const unitData = {
      name,
      sizeInM2: parseFloat(sizeInM2),
      pricePerMonth: parseFloat(pricePerMonth),
      available,
    };

    try {
      if (editingUnit) {
        // Update existing unit
        await api.updateStorageUnit(editingUnit.id, unitData);
        alert("Storage unit updated successfully.");
      } else {
        // Create new unit
        await api.createStorageUnit(unitData);
        alert("Storage unit created successfully.");
      }

      // Close the form and reset edit mode
      onClose();
    } catch (error) {
      alert("Error saving storage unit: " + error.message);
    }
  }

  return (
    <div className="form-wrapper">
      <form className="storage-unit-form" onSubmit={handleSubmit}>
        <h2>{editingUnit ? "Edit Storage Unit" : "Add New Storage Unit"}</h2>

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Size (m²):
          <input
            type="number"
            step="0.1"
            value={sizeInM2}
            onChange={(e) => setSizeInM2(e.target.value)}
            required
          />
        </label>

        <label>
          Price per Month:
          <input
            type="number"
            step="0.01"
            value={pricePerMonth}
            onChange={(e) => setPricePerMonth(e.target.value)}
            required
          />
        </label>

        <label>
          Available:
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
        </label>

        <div className="buttons">
          <button type="submit">{editingUnit ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
