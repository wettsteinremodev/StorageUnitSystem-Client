import useNotify from "../Notification/useNotify";

// Component to display a list of rentings with Edit/Delete buttons
export default function RentingList({ rentings, onEdit, onDelete }) {
  // Notification hook for error or success messages
  const notify = useNotify();

  // This component is controlled by props; does not fetch its own data

  return (
    <div>
      <h2>All Rentings</h2>

      {/* Show message if no rentings are found */}
      {rentings.length === 0 ? (
        <p>No rentings found.</p>
      ) : (
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
            {rentings.map((renting) => (
              <tr key={renting.id}>
                {/* Display related user and storage unit names */}
                <td>{renting.user.userName}</td>
                <td>{renting.storageUnit.name}</td>
                <td>{renting.startDate}</td>
                <td>{renting.endDate}</td>

                <td>
                  {/* Edit button triggers edit callback */}
                  <button onClick={() => onEdit(renting)}>Edit</button>

                  {/* Delete button triggers delete callback with confirmation */}
                  <button
                    onClick={() => {                    
                        onDelete(renting.id);
                    }}
                  >
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
