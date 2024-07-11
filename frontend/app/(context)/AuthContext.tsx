  'use client'

  import React, { createContext, useState, useContext, useEffect, useCallback, PropsWithChildren } from 'react';

  interface AuthContextType {
    isLoggedIn: boolean;
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
    const [checkedAuth, setCheckedAuth] = useState(false);

    const checkAuth = useCallback(async (): Promise<void> => {
      if (checkedAuth) return;

      try {
        const response = await fetch('http://localhost:8000/api/member/check_auth', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.roles && data.roles.includes('GUEST'));
          setMemberNick(data.memberNick); // 서버에서 닉네임 받아오기
          setCheckedAuth(true);
          console.log("체크어쓰 200" + data.memberNick)
        } else if (response.status === 401) {
          // Handle unauthorized status
          setIsLoggedIn(false);
          setMemberNick(null);
          console.log("체크어쓰 401")
        } else {
          // Handle other errors
          setIsLoggedIn(false);
          setMemberNick(null);
          console.log("체크어쓰 에러")
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
        setIsLoggedIn(false);
        setMemberNick(null);
        console.log("체크어쓰 캐치에러")
      }
    }, [checkedAuth]);

    const logout = useCallback(() => {
      setIsLoggedIn(false);
      setMemberNick(null);
      setCheckedAuth(false);
    }, []);

    useEffect(() => {
      memberNick
    }, [memberNick])

    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    return (
      <AuthContext.Provider value={{ isLoggedIn, memberNick, checkAuth, setIsLoggedIn, setMemberNick, logout }}>
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
