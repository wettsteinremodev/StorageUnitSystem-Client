// Import axios for making HTTP requests
import axios from "axios";

// Create an axios instance with a base URL for your backend API
const api = axios.create({
  baseURL: "http://localhost:8080/api", // You can change this depending on your backend's URL
});

//
// ==============================
// USER API METHODS
// ==============================
//

// Fetch all users from the server
export const fetchUsers = () => api.get("/users");

// Fetch a specific user by ID
export const fetchUserById = (id) => api.get(`/users/${id}`);

// Create a new user by sending user data (as JSON)
export const createUser = (user) => api.post("/users", user);

// Update an existing user using their ID and new user data
export const updateUser = (id, user) => api.put(`/users/${id}`, user);

// Delete a user by their ID
export const deleteUser = (id) => api.delete(`/users/${id}`);

//
// ==============================
// STORAGE UNIT API METHODS
// ==============================
//

// Get a list of all storage units
export const fetchStorageUnits = (sortedBy) => {
  // If sortedBy is given, add query param ?sortedBy=...
  const url = sortedBy ? `/storageunits?sortedBy=${sortedBy}` : "/storageunits";
  return api.get(url);
};

// Get a single storage unit by ID
export const fetchStorageUnitById = (id) => api.get(`/storageunits/${id}`);

// Create a new storage unit (name, size, price, availability, etc.)
export const createStorageUnit = (unit) => api.post("/storageunits", unit);

// Update an existing storage unit by ID
export const updateStorageUnit = (id, unit) =>
  api.put(`/storageunits/${id}`, unit);

// Delete a storage unit by ID
export const deleteStorageUnit = (id) => api.delete(`/storageunits/${id}`);

//
// ==============================
// RENTING API METHODS
// ==============================
//
// Get a list of all Renting units
export const fetchRentings = () => api.get("/rented");

// Get a single renting unit by ID
export const fetchRentingsById = (id) => api.get(`/rented/${id}`);

// Create a new renting unit (name, size, price, availability, etc.)
export const createRentings = (renting) => api.post("/rented", renting);

// Update an existing renting unit by ID
export const updateRentings = (id, renting) =>
  api.put(`/rented/${id}`, renting);

// Delete a storage unit by ID
export const deleteRentings = (id) => api.delete(`/rented/${id}`);
