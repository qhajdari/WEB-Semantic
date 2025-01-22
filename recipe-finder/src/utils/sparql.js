import axios from "axios";

const sparqlEndpoint = "https://api.triplydb.com/datasets/qhajdari/websemanticubt/sparql";

export const querySPARQL = async (sparqlQuery) => {
  try {
    const response = await axios.post(
      sparqlEndpoint,
      sparqlQuery,
      {
        headers: {
          "Content-Type": "application/sparql-query",
          Accept: "application/sparql-results+json",
        },
      }
    );
    return response.data.results.bindings;
  } catch (error) {
    console.error("Error querying SPARQL endpoint:", error);
    throw error;
  }
};
