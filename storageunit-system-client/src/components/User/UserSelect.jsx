// UserSelect.jsx
import React from "react";

export default function UserSelect({ users, selectedUserId, onChange }) {
  return (
    <select
      value={selectedUserId}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value="">Select a user</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.userName} ({user.email})
        </option>
      ))}
    </select>
  );
}
