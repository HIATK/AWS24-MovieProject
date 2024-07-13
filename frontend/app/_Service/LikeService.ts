import axios from 'axios';

export const fetchLikeStatus = async (memberNo: number, movieId: number) => {
    try {
        const response = await axios.get('/api/likes/status', {
            params: {
                memberNo,
                movieId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching like status:", error);
        throw error;
    }
};

export const updateLikeStatus = async (memberNo: number, movieId: number, liked: boolean) => {
    try {
        await axios.post('/api/likes', {
            memberNo,
            movieId,
            liked,
        });
    } catch (error) {
        console.error("Error updating like status:", error);
        throw error;
    }
};
