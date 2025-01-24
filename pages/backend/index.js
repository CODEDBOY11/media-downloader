import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

// Use CORS to allow cross-origin requests
app.use(cors());

// TMDB API Key and Base URL
const TMDB_API_KEY = "04553a35f2a43bffba8c0dedd36ac92b";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Route for searching movies or media
app.get("/api/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}`
    );
    const data = await response.json();

    return res.status(200).json({
      results: data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        description: movie.overview,
      })),
    });
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

// Route for getting details of a specific movie
app.get("/api/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
    const data = await response.json();

    if (!data || data.status_code === 34) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.status(200).json({
      id: data.id,
      title: data.title,
      image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      description: data.overview,
      release_date: data.release_date,
      genres: data.genres.map((genre) => genre.name),
    });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
