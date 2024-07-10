import axios from 'axios';
import { PostDetails } from './(types)/types';

export const getPostsByMovieId = async (movieId: number): Promise<PostDetails[]> => {
    try {
        const response = await axios.get(`/api/posts/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts by movie ID:", error);
        return [];
    }
};

export const regPost = async (content: string, rating: number, movieId: number, regDate: string, memberNick: string): Promise<void> => {
    try {
        const postData = {
            postContent: content,
            ratingStar: rating,
            movieId: movieId,
            regDate: regDate,
            memberNick: memberNick
        };
        console.log("Sending post data:", postData);
        await axios.post('/api/posts/register', postData);
        console.log("Post submitted successfully");
    } catch (error) {
        console.error("Error submitting post:", error);
        throw error;
    }
};
