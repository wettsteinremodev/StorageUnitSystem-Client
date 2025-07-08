import { useState, useEffect } from "react";
import * as api from "../../api/api"; // API calls for user create/update
import useNotify from "../Notification/useNotify";

// Form component for creating or editing a user
export default function UserForm({ editingUser, onClose, onSave }) {
  // Local state for form inputs
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Errors object to store validation messages
  const [errors, setErrors] = useState({});

  const notify = useNotify(); // Notifications for feedback

  // When editingUser changes, populate form or reset fields
  useEffect(() => {
    if (editingUser) {
      setUserName(editingUser.userName);
      setEmail(editingUser.email);
      setPassword(""); // Never prefill password for security
    } else {
      // Reset form fields for new user
      setUserName("");
      setEmail("");
      setPassword("");
    }
    setErrors({});
  }, [editingUser]);

  // Validate input fields against backend constraints
  function validate() {
    const newErrors = {};

    // userName: required, length 1-15
    if (!userName.trim()) {
      newErrors.userName = "User Name is required.";
    } else if (userName.length > 15) {
      newErrors.userName = "User Name must be at most 15 characters.";
    }

    // email: required, valid email format
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      // Simple email regex for frontend validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Email format is invalid.";
      }
    }

    // password:
    // required on create; on edit only validate if provided
    if (!editingUser) {
      if (!password) {
        newErrors.password = "Password is required.";
      } else if (password.length < 8 || password.length > 20) {
        newErrors.password = "Password must be between 8 and 20 characters.";
      }
    } else if (password) {
      if (password.length < 8 || password.length > 20) {
        newErrors.password = "Password must be between 8 and 20 characters.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle form submission to create or update user
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation: all fields required except password only for new user
    if (!validate()) {
      notify.info("Please fix the validation errors.");
      return;
    }

    // Prepare user data payload
    const userData = {
      userName,
      email,
      ...(password ? { password } : {}), // Include password only if set
    };

    try {
      if (editingUser) {
        // Update existing user
        await api.updateUser(editingUser.id, userData);
        notify.success("User updated successfully.");
      } else {
        // Create new user
        await api.createUser(userData);
        notify.success("User created successfully.");
      }

      onSave(); // Notify parent to refresh user list
      onClose(); // Close the form
    } catch (error) {
      // Handle validation or other errors from backend
      if (error.response && error.response.data) {
        const errors = error.response.data;
        const errorMessages = Object.values(errors).join("\n");
        notify.error(errorMessages);
      } else {
        notify.error("Error saving user: " + error.message);
      }
    }
  }

  return (
    <div>
      <h2>{editingUser ? "Edit User" : "Add New User"}</h2>

      <form className="storage-unit-form" onSubmit={handleSubmit}>
        {/* User Name Input */}
        <div>
          <label>
            User Name:
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
          {errors.userName && <p className="form-error">{errors.userName}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              placeholder={
                editingUser ? "Leave blank to keep current password" : ""
              }
              onChange={(e) => setPassword(e.target.value)}
              required={!editingUser}
            />
          </label>
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        {/* Buttons */}
        <div className="buttons">
          <button type="submit">{editingUser ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
