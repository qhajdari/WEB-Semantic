import React from "react";
import "./App.css";
import SearchRecipes from "./components/SearchRecipes";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Recipe Finder</h1>
      </header>
      <main>
        <SearchRecipes />
      </main>
    </div>
  );
}

export default App;
