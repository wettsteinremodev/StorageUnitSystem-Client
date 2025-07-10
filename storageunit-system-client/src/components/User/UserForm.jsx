import { useState, useEffect } from "react";
import * as api from "../../api/api";
import useNotify from "../Notification/useNotify";

export default function UserForm({ editingUser, onClose, onSave }) {
  // Form state variables
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Tracking Validation ERRORS
  const [errors, setErrors] = useState({});

  // My Notify Alerts
  const notify = useNotify();

  // Populate form fields if editing an existing user
  useEffect(() => {
    if (editingUser) {
      setUserName(editingUser.userName);
      setEmail(editingUser.email);
      setPassword(""); // Don't prefill password for security
    } else {
      // Reset form fields for new user
      setUserName("");
      setEmail("");
      setPassword("");
    }
    setErrors({});
  }, [editingUser]);

  // Validation
  function validate() {
    const newErrors = {};

    // Validate userName: required, max 15 chars
    if (!userName.trim()) newErrors.userName = "User Name is required.";
    else if (userName.length > 15)
      newErrors.userName = "User Name must be at most 15 characters.";

    // Validate email: required, valid format
    if (!email.trim()) newErrors.email = "Email is required.";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = "Email format is invalid.";
    }

    // Validate password:
    // - required on create
    // - optional on edit, but if provided must be valid length
    if (!editingUser) {
      if (!password) newErrors.password = "Password is required.";
      else if (password.length < 8 || password.length > 20)
        newErrors.password = "Password must be between 8 and 20 characters.";
    } else if (password) {
      if (password.length < 8 || password.length > 20)
        newErrors.password = "Password must be between 8 and 20 characters.";
    }

    setErrors(newErrors);
    return newErrors;
  }

  // Handle form submission to create or update user
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation of inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      notify.warning("Check:\n" + errorMessages);
      return;
    }

    // Construct user object matching backend format
    const userData = {
      userName,
      email,
      ...(password ? { password } : {}),
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

      onSave(); // Trigger parent refresh
      onClose(); // Close the form
    } catch (error) {
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
        <div>
          <label>
            User Name:
            <input
              type="text"
              value={userName}
              placeholder="Enter usernam"
              onChange={(e) => setUserName(e.target.value) }
            />
          </label>
          {errors.userName && <p className="form-error">{errors.userName}</p>}
        </div>

        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        <button type="submit">{editingUser ? "Update" : "Create"}</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}
