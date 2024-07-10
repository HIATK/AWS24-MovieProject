import axios from 'axios';
interface PostDetails {
    postId: any;     movieId: string;     postContent: string;     ratingStar: number;
}
export const getPostsByMovieId = async (movieId: number) => {
    try {
        const response = await axios.get(`/api/posts/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts by movie ID:", error);
        return [];
    }
};

export const submitPost = async (content: string, rating: number, movieId: number) => {
    try {
        const postData = {
            postContent: content,
            ratingStar: rating,
            movieId: movieId
        };
        console.log("Sending post data:", postData);
        const response = await axios.post('/api/posts/register', postData);
        console.log("Response data:", response.data);

        // 백엔드 응답을 PostDetails 형식에 맞게 변환
        const newPost: PostDetails = {
            postId: response.data.postId,
            movieId: movieId.toString(),
            postContent: content,
            ratingStar: rating
        };

        return newPost;
    } catch (error) {
        console.error("Error submitting post:", error);
        throw error;
    }
};