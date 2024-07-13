import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/movies";

export const getMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/now-playing`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const getMovieByMovieId = async (id: number) => {
  try {
    console.log(`무비 아이디 : ${id}`);
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getVideosByMovieId = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos/${id}`);
    console.log("트레일러 요청이다", response.data);
    const videos = response.data;
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    return randomVideo;
  } catch (error) {
    console.error("트레일러 요청 실패다 ", error);
    throw error;
  }
}
