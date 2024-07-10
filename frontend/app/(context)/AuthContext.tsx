'use client'

import React, { createContext, useState, useContext, useEffect, useCallback, PropsWithChildren } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  memberNick: string | null;
  checkAuth: () => void;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setMemberNick: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberNick, setMemberNick] = useState<string | null>(null);
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
        const data = await response.json();
        // Check if user is considered logged in based on the presence of specific roles
        setIsLoggedIn(data.roles && data.roles.includes('GUEST'));
        setMemberNick(data.memberNick); // 서버에서 닉네임 받아오기
      } else if (response.status === 401) {
        // Handle unauthorized status
        setIsLoggedIn(false);
        setMemberNick(null);
      } else {
        // Handle other errors
        setIsLoggedIn(false);
        setMemberNick(null);
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
      setIsLoggedIn(false);
      setMemberNick(null);
    }
  }, [checkedAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, memberNick, checkAuth, setIsLoggedIn, setMemberNick }}>
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
