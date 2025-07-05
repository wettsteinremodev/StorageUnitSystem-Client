import { useState, useEffect } from "react";
import * as api from "../../api/api";

export default function RentingList({ onEdit }) {
  // State variable to hold the list of rentings fetched from backend
  const [rentings, setRentings] = useState([]);

  // useEffect to fetch rentings when component mounts
  useEffect(() => {
    fetchRentingsFromAPI();
  }, []);

  // Function to fetch all rentings from the backend API
  async function fetchRentingsFromAPI() {
    try {
      // Call your API method to get rentings
      const response = await api.fetchRentings();

      // Axios response object has actual data in .data property
      setRentings(response.data);
    } catch (error) {
      // Show alert on failure to load rentings
      alert("Failed to fetch rentings: " + error.message);
    }
  }

  // Function to delete a renting by ID, with confirmation dialog
  async function handleDelete(id) {
    // Confirm with the user before deleting
    if (!window.confirm("Are you sure you want to delete this renting?")) {
      return; // Exit if user cancels
    }

    try {
      // Call your API method to delete renting
      await api.deleteRentings(id);

      // Reload the list of rentings after successful deletion
      fetchRentingsFromAPI();
    } catch (error) {
      // Show alert on failure to delete renting
      alert("Failed to delete renting: " + error.message);
    }
  }

  return (
    <div>
      <h2>All Rentings</h2>

      {/* Display message if there are no rentings */}
      {rentings.length === 0 ? (
        <p>No rentings found.</p>
      ) : (
        // Render a table showing all rentings
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>User</th>
              <th>Storage Unit</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Map each renting to a table row */}
            {rentings.map((renting) => (
              <tr key={renting.id}>
                {/* Show the user's username */}
                <td>{renting.user.userName}</td>

                {/* Show the name of the rented storage unit */}
                <td>{renting.storageUnit.name}</td>

                {/* Show start and end dates */}
                <td>{renting.startDate}</td>
                <td>{renting.endDate}</td>

                {/* Actions: Edit and Delete */}
                <td>
                  {/* Edit button calls onEdit callback passed from parent */}
                  <button onClick={() => onEdit(renting)}>Edit</button>

                  {/* Delete button triggers handleDelete */}
                  <button onClick={() => handleDelete(renting.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
