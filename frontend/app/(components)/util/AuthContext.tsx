'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, PropsWithChildren } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  checkAuth: () => void;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const checkAuth = useCallback(async () => {
    if (checkedAuth) return;

    setCheckedAuth(true);

    try {
      const response = await fetch('http://localhost:8000/api/member/check_auth', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const roles = await response.json();
        setIsLoggedIn(roles.includes('GUEST')); // 사용자 권한 확인
      } else if (response.status === 401) {
        setIsLoggedIn(false); // 401 상태일 경우 isLoggedIn을 false로 설정
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
      setIsLoggedIn(false);
    }
  }, [checkedAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkAuth, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
