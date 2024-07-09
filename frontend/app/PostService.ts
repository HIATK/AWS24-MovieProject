import axios from 'axios';

export const getPostsByMovieId = async (movieId: string) => {
    try {
        const response = await axios.get(`/api/posts/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts by movie ID:", error);
        return [];
    }
};
