import { useState, useEffect } from "react";
import * as api from "../../api/api";

export default function RenForm() {
  const [form, setFrom] = useState({
    userId: "",
    storageUnitId: "",
    startDate: "",
    endDate: "",
  });

  const [users, setUsers] = useState([]);
  const [storageUnits, setStorageUnits] = useState([]);

  useEffect(() => {
    api.fetchUsers().then(setUsers).catch(console.error);
    api.fetchStorageUnits().then(setStorageUnits).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFrom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <form>
        <label htmlFor="user">User:</label>
        <select
          name="userId"
          id="user"
          value={form.userId}
          onChange={handleChange}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.userId} value={u.userId}>
              {u.name}
            </option>
          ))}
        </select>

        <label htmlFor="storageUnit">Storage Unit:</label>
        <select
          name="storageUnitId"
          id="storageUnit"
          value={form.storageUnitId}
          onChange={handleChange}
        >
          <option value="">Select Storage Unit</option>
          {storageUnits.map((s) => (
            <option key={s.storageUnitId} value={s.storageUnitId}>
              {s.name}
            </option>
          ))}
        </select>

        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          value={form.startDate}
          onChange={handleChange}
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          value={form.endDate}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
