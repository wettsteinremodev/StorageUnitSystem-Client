// src/components/Users/UserForm.jsx

import { useState, useEffect } from "react";
import * as api from "../../api/api"; // API calls for user create/update

// Form to create or update a user
export default function UserForm({ editingUser, onClose }) {
  // State for form fields; password is handled separately for security
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // When editingUser changes, populate form or reset
  useEffect(() => {
    if (editingUser) {
      setUserName(editingUser.userName);
      setEmail(editingUser.email);
      setPassword(""); // Don't prefill password for security
    } else {
      setUserName("");
      setEmail("");
      setPassword("");
    }
  }, [editingUser]);

  // Handle form submission to create or update user
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation (you can expand as needed)
    if (!userName || !email || (!editingUser && !password)) {
      alert(
        "Please fill all required fields. Password is required for new users."
      );
      return;
    }

    // Create user object with form data; password only sent if filled
    const userData = {
      userName,
      email,
      // Only include password if creating new or changing
      ...(password ? { password } : {}),
    };

    try {
      if (editingUser) {
        // Update existing user
        await api.updateUser(editingUser.id, userData);
        alert("User updated successfully.");
      } else {
        // Create new user
        await api.createUser(userData);
        alert("User created successfully.");
      }

      onClose(); // Close form on success
    } catch (error) {
      alert("Error saving user: " + error.message);
    }
  }

  return (
    <div className="form-wrapper">
      <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
      <form className="storage-unit-form" onSubmit={handleSubmit}>
        <div>
          <label>
            User Name:{" "}
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Email:{" "}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Password:{" "}
            <input
              type="password"
              value={password}
              placeholder={
                editingUser ? "Leave blank to keep current password" : ""
              }
              onChange={(e) => setPassword(e.target.value)}
              // password required only for new user
              required={!editingUser}
            />
          </label>
        </div>

        <button type="submit">{editingUser ? "Update" : "Create"}</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}
