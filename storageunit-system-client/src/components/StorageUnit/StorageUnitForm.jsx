import { useState, useEffect } from "react";
import * as api from "../../api/api"; // CRUD API methods
import useNotify from "../Notification/useNotify"; // Toast notifications

/**
 * StorageUnitForm: Handles both creating new units and editing existing ones.
 * Shows inputs for name, size, price, and availability.
 */
export default function StorageUnitForm({
  editingUnit,
  onClose,
  onSave = () => {},
}) {
  // Local state for each form field
  const [name, setName] = useState("");
  const [sizeInM2, setSizeInM2] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [available, setAvailable] = useState(true);

  // Error state for client-side validation
  const [errors, setErrors] = useState({});

  const notify = useNotify(); // For user feedback

  /**
   * Whenever `editingUnit` changes (or first mounts), populate fields if
   * editing an existing unit, or clear them for a new unit.
   */
  useEffect(() => {
    if (editingUnit) {
      setName(editingUnit.name);
      setSizeInM2(editingUnit.sizeInM2);
      setPricePerMonth(editingUnit.pricePerMonth);
      setAvailable(editingUnit.available);
    } else {
      setName("");
      setSizeInM2("");
      setPricePerMonth("");
      setAvailable(true);
    }
  }, [editingUnit]);

  /**
   * Frontend validation aligned with backend (Java) constraints:
   * - Name: required, length 2–20
   * - Size: number between 1.0 and 1000.0
   * - Price: must be > 0
   */
  function validate() {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    } else if (name.length < 2 || name.length > 20) {
      newErrors.name = "Name must be between 2 and 20 characters.";
    }

    const size = parseFloat(sizeInM2);
    if (!sizeInM2 || isNaN(size)) {
      newErrors.sizeInM2 = "Size is required.";
    } else if (size < 1.0 || size > 1000.0) {
      newErrors.sizeInM2 = "Size must be between 1.0 and 1000.0 m².";
    }

    const price = parseFloat(pricePerMonth);
    if (!pricePerMonth || isNaN(price)) {
      newErrors.pricePerMonth = "Price is required.";
    } else if (price <= 0) {
      newErrors.pricePerMonth = "Price must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Submit handler: calls either create or update API, shows a toast,
   * then triggers parent callbacks (`onSave`, `onClose`).
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      notify.info("Please fix the validation errors.");
      return;
    }

    // Build the payload
    const data = {
      name,
      sizeInM2: parseFloat(sizeInM2),
      pricePerMonth: parseFloat(pricePerMonth),
      available,
    };

    try {
      if (editingUnit) {
        // Update existing unit
        await api.updateStorageUnit(editingUnit.id, data);
        notify.success("Updated successfully");
      } else {
        // Create new unit
        await api.createStorageUnit(data);
        notify.success("Created successfully");
      }

      onSave(); // Refresh list in parent
      onClose(); // Close the form
    } catch (err) {
      // Show backend validation or generic error
      const msg = err.response?.data
        ? Object.values(err.response.data).join("\n")
        : err.message;
      notify.error(msg);
    }
  }

  return (
    <form className="storage-unit-form" onSubmit={handleSubmit}>
      <h2>{editingUnit ? "Edit Storage Unit" : "Add New Storage Unit"}</h2>

      {/* Name input */}
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </label>

      {/* Size input */}
      <label>
        Size (m²):
        <input
          type="number"
          step="0.1"
          value={sizeInM2}
          onChange={(e) => setSizeInM2(e.target.value)}
          required
        />
        {errors.sizeInM2 && <p className="form-error">{errors.sizeInM2}</p>}
      </label>

      {/* Price input */}
      <label>
        Price per Month:
        <input
          type="number"
          step="0.01"
          value={pricePerMonth}
          onChange={(e) => setPricePerMonth(e.target.value)}
          required
        />
        {errors.pricePerMonth && (
          <p className="form-error">{errors.pricePerMonth}</p>
        )}
      </label>

      {/* Availability toggle */}
      <label>
        Available:
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
        />
      </label>

      {/* Action buttons */}
      <div className="buttons">
        <button type="submit">{editingUnit ? "Update" : "Create"}</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}
