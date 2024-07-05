import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000', // 백엔드 API URL에 맞게 설정
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

// // 요청 인터셉터: 인증 토큰 추가
// instance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token'); // 또는 다른 저장 방식 사용
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // 응답 인터셉터: 에러 처리
// instance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             // 401 에러 처리: 예를 들어, 로그인 페이지로 리디렉션
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default instance;