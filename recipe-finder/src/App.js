import React from "react";
import "./App.css";
import RecipeSearchByIngredients from "./components/SearchByIngredients";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Recipe Management Ontology</h1>
      </header>
      <main>
        <RecipeSearchByIngredients />
      </main>
    </div>
  );
}

export default App;
