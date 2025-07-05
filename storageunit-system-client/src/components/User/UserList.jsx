// src/components/Users/UserList.jsx

import { useEffect, useState } from "react";
import * as api from "../../api/api"; // API calls for users

// Component to display a list of users with Edit/Delete buttons
export default function UserList({ onEdit }) {
  // State to hold all users fetched from backend
  const [users, setUsers] = useState([]);

  // Fetch all users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend API and update state
  async function fetchUsers() {
    try {
      const response = await api.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      alert("Failed to load users: " + error.message);
    }
  }

  // Delete user by id with confirmation and refresh list
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.deleteUser(id);
      fetchUsers(); // Refresh after delete
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    }
  }

  return (
    <div>
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>
                  {/* Edit button triggers onEdit with this user */}
                  <button onClick={() => onEdit(user)}>Edit</button>

                  {/* Delete button triggers delete */}
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
