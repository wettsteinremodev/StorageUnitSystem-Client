import { useState, useEffect } from "react";
import UserList from "../components/User/UserList";
import UserForm from "../components/User/UserForm";
import * as api from "../api/api";

/**
 * UserPage
 * - Manage users: create, edit, delete
 * - Displays user form and list side by side
 */
export default function UserPage() {
  // Currently selected user for editing; null = new user
  const [editingUser, setEditingUser] = useState(null);

  // List of all users from the backend
  const [users, setUsers] = useState([]);

  /** Fetch all users from API */
  async function fetchUsers() {
    try {
      const response = await api.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  // Fetch users on first render
  useEffect(() => {
    fetchUsers();
  }, []);

  /** Refresh list after create/update/delete */
  const handleRefresh = () => {
    fetchUsers();
  };

  /** Open form in edit mode for selected user */
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  /** Close form (after save or cancel) */
  const handleFormClose = () => {
    setEditingUser();
  };

  /** Delete a user with confirmation, then refresh list */
 const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this renting?")) return;

    try {
      await api.deleteUser(id);
      handleRefresh();
    } catch (error) {
      console.error("Failed to delete renting:", error);
    }
  };


  return (
    <div>
      <h1>User Management</h1>

      <div className="two-column-layout">
        {/* Right panel: Form to create or edit a user */}
        <div className="right-panel">
          <UserForm
            editingUser={editingUser}
            onClose={handleFormClose}
            onSave={handleRefresh}
          />
        </div>

        {/* Left panel: List of existing users */}
        <div className="left-panel">
          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
