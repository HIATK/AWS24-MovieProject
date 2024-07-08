import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const getMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/now-playing`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const getMovieById = async (id: string) => {
  try {
    console.log(`Fetching movie with ID: ${id}`);
    const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
