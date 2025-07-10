import StorageUnitList from "../components/StorageUnit/StorageUnitListHome";

/**
 * HomePage
 * - Entry point for users to browse storage units
 * - Allows users to click a unit to start renting
 */
export default function HomePage() {
  return (
    <div className="App">
      <h1>Homepage</h1>
      <hr />
      <p>Click on one of the Units to Create a Renting</p>

      {/* List of available storage units */}
      <StorageUnitList />
    </div>
  );
}

