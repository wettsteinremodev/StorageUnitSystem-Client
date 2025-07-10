import "./App.css";
import { Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// Layout and page components
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import RentingPage from "./pages/RentingPage";
import Impressum from "./pages/Impressum";

/**
 * Root App Component
 * - Provides global Snackbar notifications
 * - Defines client-side routes using React Router
 */
function App() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Routes>
        {/* Main layout containing nested routes */}
        <Route path="/" element={<Layout />}>
          {/* Homepage */}
          <Route index element={<HomePage />} />

          {/* Admin panel to manage storage units */}
          <Route path="admin" element={<AdminPage />} />

          {/* User management interface */}
          <Route path="user" element={<UserPage />} />

          {/* Rentings management interface */}
          <Route path="rentings" element={<RentingPage />} />

          {/* Static Impressum page */}
          <Route path="impressum" element={<Impressum />} />
        </Route>
      </Routes>
    </SnackbarProvider>
  );
}

export default App;
