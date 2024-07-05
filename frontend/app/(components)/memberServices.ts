// src/services/memberService.ts
import axios from './axiosInstance';  // axios 인스턴스를 사용

const API_URL = '/api/member';

export const getMemberDetails = async () => {
    const response = await axios.get(`${API_URL}/mypage`, { withCredentials: true });
    return response.data;
};

export const getFavoriteMovies = async () => {
    const response = await axios.get(`${API_URL}/favorites`, { withCredentials: true });
    return response.data;
};
