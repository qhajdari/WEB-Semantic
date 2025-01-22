import React, { useState } from "react";
import { querySPARQL } from "../utils/sparql";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const RecipeSearchByIngredients = () => {
  const [ingredients, setIngredients] = useState(""); 
  const [recipes, setRecipes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Për recetën e përzgjedhur për popup
  const [openDialog, setOpenDialog] = useState(false); // Gjendja e popup-it

  // Search recipes by ingredients
  const fetchRecipes = async () => {
    setLoading(true);
    const ingredientList = ingredients.split(",").map((ingredient) => ingredient.trim().toLowerCase());
    
    const sparqlQuery = `
      PREFIX : <http://example.org/ontology#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  
      SELECT ?recipe ?recipeName ?cuisineName ?prepTime ?cookTime (GROUP_CONCAT(?ingredientName; separator=", ") AS ?ingredients) WHERE {
        ?recipe rdf:type :Recipe .
        ?recipe rdfs:label ?recipeName .
        ?recipe :belongsToCuisine ?cuisine .
        ?cuisine rdfs:label ?cuisineName .
        ?recipe :preparationTime ?prepTime .
        ?recipe :cookingTime ?cookTime .
        ?recipe :hasIngredient ?ingredient .
        ?ingredient rdfs:label ?ingredientName .
        FILTER (${ingredientList
          .map(
            (ingredient) => `EXISTS { ?recipe :hasIngredient ?ing . ?ing rdfs:label ?label . FILTER(CONTAINS(LCASE(?label), "${ingredient}")) }`
          )
          .join(" && ")})
      }
      GROUP BY ?recipe ?recipeName ?cuisineName ?prepTime ?cookTime
    `;
  
    try {
      const results = await querySPARQL(sparqlQuery);
      setRecipes(results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Open Popup
  const handleOpenDialog = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenDialog(true);
  };

  // Close popup
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecipe(null);
  };

  return (
    <div>
      <h4>Search Recipes by Ingredients</h4>
      <TextField
        label="Enter ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="e.g. tomato, onion, chicken"
      />
      <Button variant="contained" onClick={fetchRecipes} sx={{ mt: 1, ml: 2, backgroundColor: "#4caf50" }}>
        Search Recipes
      </Button>

      {loading && <p>Loading recipes...</p>}

      {recipes.length > 0 && (
        <div>
          <h2>Found Recipes</h2>
          <TableContainer component={Paper} sx={{ maxWidth: "600px", margin: "0 auto"  }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Recipe Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipes.map((recipe, index) => (
                  <TableRow key={index}>
                    <TableCell>{recipe.recipeName?.value || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenDialog(recipe)}
                        sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                      >
                        More Info
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Popup with more info */}
      {selectedRecipe && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedRecipe.recipeName?.value || "Recipe Details"}</DialogTitle>
          <DialogContent>
            <p><strong>Cuisine:</strong> {selectedRecipe.cuisineName?.value || "N/A"}</p>
            <p><strong>Ingredients:</strong> {selectedRecipe.ingredients?.value || "No Ingredients"}</p>
            <p><strong>Preparation Time:</strong> {selectedRecipe.prepTime?.value || "N/A"} minutes</p>
            <p><strong>Cooking Time:</strong> {selectedRecipe.cookTime?.value || "N/A"} minutes</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default RecipeSearchByIngredients;
