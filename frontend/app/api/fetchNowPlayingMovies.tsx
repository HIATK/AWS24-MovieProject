import axios from 'axios';

export async function fetchNowPlayingMovies() {
  try {
    const response = await axios.get('/api/movies/now-playing');
    return response.data;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return [];
  }
}
