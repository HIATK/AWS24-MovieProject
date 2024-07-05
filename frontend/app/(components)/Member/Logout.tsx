import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // 로그아웃 처리
        const logout = async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // 서버에 필요한 경우 추가 데이터를 전송할 수 있음
                    // body: JSON.stringify({ additionalData: 'value' }),
                });

                if (response.ok) {
                    // 토큰 삭제
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');

                    // 로그아웃 후 리디렉션
                    router.push('/'); // 로그아웃 후 리디렉션할 경로
                } else {
                    throw new Error('로그아웃 실패');
                }
            } catch (error) {
                console.error('로그아웃 에러:', error);
            }
        };

        logout();
    }, []);

    return <div>로그아웃 중...</div>;
};

export default Logout;