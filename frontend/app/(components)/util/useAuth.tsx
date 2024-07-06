'use client';

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = async () => {
    console.log('checkAuth 함수 호출됨');
    try {
      const response = await fetch('http://localhost:8000/api/check_auth', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
      });
      console.log('fetch 응답 상태:', response.status);
      if (response.ok) {
        const roles = await response.json();
        console.log('Roles:', roles);
        setIsLoggedIn(roles.includes('GUEST')); // 사용자 권한 확인 (예시)
      } else if (response.status === 401) {
        console.error('Unauthorized access');
        setIsLoggedIn(false); // 401 상태일 경우 isLoggedIn을 false로 설정
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    console.log('초기 useEffect 호출됨');
    checkAuth();
  }, []);

  return { isLoggedIn, checkAuth, setIsLoggedIn };
};
