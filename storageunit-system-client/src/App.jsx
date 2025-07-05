import "./App.css";
// import Renting from "./pages/RentingPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import Layout from "./pages/Layout";
import Impressum from "./pages/Impressum";
import UserPage from "./pages/UserPage";
import RentingPage from "./pages/RentingPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* Main layout wrapper */}
      <Route path="/" element={<Layout />}>
        {/* Nested pages */}
        <Route index element={<HomePage />} />

        {/* <Route path="rentings" element={<Renting />} /> */}
        <Route path="admin" element={<AdminPage />} />

        {/* <Route path="user" element={<User />} /> */}
        <Route path="user" element={<UserPage />} />

        {/* <Route path="rentings" element={<User />} /> */}
        <Route path="rentings" element={<RentingPage />} />

        {/* <Route path="user" element={<User />} /> */}
        <Route path="impressum" element={<Impressum />} />
      </Route>
    </Routes>
  );
}

export default App;
