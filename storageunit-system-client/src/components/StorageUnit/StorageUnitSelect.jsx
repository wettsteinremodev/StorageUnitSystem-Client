// StorageUnitSelect.jsx
import React from "react";

export default function StorageUnitSelect({
  storageUnits,
  selectedUnitId,
  onChange,
}) {
  return (
    <select
      value={selectedUnitId}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value="">Select a storage unit</option>
      {storageUnits.map((unit) => (
        <option key={unit.id} value={unit.id}>
          {unit.name} - {unit.sizeInM2}m² - ${unit.pricePerMonth}/month
        </option>
      ))}
    </select>
  );
}
