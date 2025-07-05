// src/pages/UserPage.jsx

import { useState } from "react";

// Import components to display list of users and user form
import UserList from "../components/User/UserList";
import UserForm from "../components/User/UserForm";

// UserPage component for managing users
export default function UserPage() {
  // State to track which user is currently being edited, null means "create new"
  const [editingUser, setEditingUser] = useState(null);

  // Triggered when clicking "Edit" on a user in the list
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Called to reset editingUser to null, closes the form
  const handleFormClose = () => {
    setEditingUser(null);
  };

  return (
    <div className="two-column-layout">
      <h1>User Management</h1>
      <div className="right-panel">
        {/* User form for creating or editing a user */}
        <UserForm editingUser={editingUser} onClose={handleFormClose} />
      </div>
      <hr />
      <div className="left-panel">
        {/* User list with onEdit callback to allow editing a user */}
        <UserList onEdit={handleEdit} />
      </div>
    </div>
  );
}
