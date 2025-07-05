import { useState, useEffect } from "react";
import StorageUnitList from "../components/StorageUnit/StorageUnitListHome";
export default function Home() {
  return (
    <div className="App">
      <h1>Homepage</h1>
      <hr />
      <p>Click on one of the Units to Create a Renting</p>
      {/* Show list of storage units */}
      <StorageUnitList />
    </div>
  );
}
