import { useState, useEffect } from "react";
import UserList from "../components/User/UserList";
import UserForm from "../components/User/UserForm";

import * as api from "../api/api"; // API for user CRUD

// UserPage component for managing users
export default function UserPage() {
  // Track which user is currently being edited; null means create new user
  const [editingUser, setEditingUser] = useState(null);

  // State holding the list of all users fetched from backend
  const [users, setUsers] = useState([]);

  // Fetch all users from backend API
  async function fetchUsers() {
    try {
      const response = await api.fetchUsers(); // API call to get users
      setUsers(response.data); // Update state with fetched users
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Optionally notify user about failure here
    }
  }

  // Load users once when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Refresh handler to reload user list after create/update/delete
  const handleRefresh = () => {
    fetchUsers();
  };

  // Called when clicking Edit on a user
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Called to close the form (cancel editing or after save)
  const handleFormClose = () => {
    setEditingUser(null);
  };

  // Delete user by id and refresh list afterwards
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.deleteUser(id); // API call to delete user
      handleRefresh(); // Refresh user list after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Optionally notify user about failure
    }
  };

  return (
    <div>
      <h1>User Management</h1>

      {/* Layout with two columns: form and list */}
      <div className="two-column-layout">
        {/* Right panel: user form for create/edit */}
        <div className="right-panel">
          <UserForm
            editingUser={editingUser} // User to edit or null to add new
            onClose={handleFormClose} // Close form callback
            onSave={handleRefresh} // Refresh list after save
          />
        </div>

        {/* Left panel: user list */}
        <div className="left-panel">
          <UserList
            users={users} // Pass current users to list
            onEdit={handleEdit} // Edit user callback
            onDelete={handleDelete} // Delete user callback
          />
        </div>
      </div>
    </div>
  );
}
