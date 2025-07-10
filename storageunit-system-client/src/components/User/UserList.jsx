import useNotify from "../Notification/useNotify";

// Component to display a list of users with Edit/Delete buttons
export default function UserList({ users, onEdit, onDelete }) {
  const notify = useNotify();



  return (
    <div>
      <h2>All Users</h2>

      {/* Show message if no users found */}
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
                  {/* Edit button calls onEdit with selected user */}
                  <button onClick={() => onEdit(user)}>Edit</button>

                  {/* Delete button calls local handler that confirms and tries delete */}
                  <button onClick={() => onDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
