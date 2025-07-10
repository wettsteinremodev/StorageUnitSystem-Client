import { Outlet } from "react-router-dom"; //  renders current child route
import Navigation from "./Navigation"; // Import the navigation bar


// Layout wrapper that includes navigation + dynamic content
export default function Layout() {
  return (
    <div className="App">
      <header>
        {/* Navigation is shown on every page */}
        <Navigation className="navbar"/>
        <h4>Welcome to the Storage Unit Renting Site</h4>
        <hr />
      </header>

      {/* This will render the child route's content */}
      <main>
        <Outlet />
      </main>
      <footer>

      </footer>
    </div>
  );
}
