'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, PropsWithChildren } from 'react';
import axios from 'axios';
import { checkAuth as checkAuthService, refreshAccessToken as refreshAccessTokenService } from '@/_Service/MemberService';

interface AuthContextType {
  isLoggedIn: boolean;
  memberNo: number | null;
  memberNick: string | null;
  checkAuth: () => Promise<void>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setMemberNick: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberNick, setMemberNick] = useState<string | null>(null);
  const [memberNo, setMemberNo] = useState<number | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const checkAuth = useCallback(async (): Promise<void> => {
    if (checkedAuth) return;

    try {
      const data = await checkAuthService();
      setIsLoggedIn(data.roles && (data.roles.includes('MEMBER') || data.roles.includes('GUEST')));
      setMemberNo(data.memberNo);
      setMemberNick(data.memberNick);
      setCheckedAuth(true);
      console.log("체크어쓰 200" + data.memberNick);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
          setMemberNo(null);
          setMemberNick(null);
          console.log("체크어쓰 401");
        } else if (error.response && error.response.status === 403) {
          const retryCheckAuth = await refreshAccessTokenService();
          if (retryCheckAuth) {
            await checkAuth();
          }
        } else {
          setIsLoggedIn(false);
          setMemberNo(null);
          setMemberNick(null);
          console.log("체크어쓰 에러");
        }
      } else {
        console.error('Failed to check auth:', error);
        setIsLoggedIn(false);
        setMemberNo(null);
        setMemberNick(null);
        console.log("체크어쓰 캐치에러");
      }
    }
  }, [checkedAuth]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setMemberNo(null);
    setMemberNick(null);
    setCheckedAuth(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, memberNick, memberNo, checkAuth, setIsLoggedIn, setMemberNick, logout }}>
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
