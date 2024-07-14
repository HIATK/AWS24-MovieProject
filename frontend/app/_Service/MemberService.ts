import axios from 'axios';

const API_URL = 'http://localhost:8000/api/member';

export const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', 
        { username, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}/check_auth`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/check_auth/refresh`, {}, { withCredentials: true });
    return response.data.accessToken;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

