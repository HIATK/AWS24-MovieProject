  'use client'

  import React, { createContext, useState, useContext, useEffect, useCallback, PropsWithChildren } from 'react';

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

    const refreshAccessToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/member/check_auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }
  
        const data = await response.json();
        return data.accessToken;
      } catch (error) {
        console.error('Failed to refresh access token:', error);
        return null;
      }
    };

    const checkAuth = useCallback(async (): Promise<void> => {
      if (checkedAuth) return;

      try {
        const response = await fetch('http://localhost:8000/api/member/check_auth', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.roles && data.roles.includes('MEMBER') || data.roles.includes('GUEST'));
          setMemberNo(data.memberNo); 
          setMemberNick(data.memberNick); 
          setCheckedAuth(true);
          console.log("체크어쓰 200" + data.memberNick)
        } else if (response.status === 401) {
          // Handle unauthorized status
          setIsLoggedIn(false);
          setMemberNo(null);
          setMemberNick(null);
          console.log("체크어쓰 401")
        } else if (response.status === 403) {
          const retryCheckAuth = await refreshAccessToken();
          retryCheckAuth;
          if (retryCheckAuth) {
            // Retry the checkAuth request with the new access token
            await checkAuth();
          }
        } else {
          // Handle other errors
          setIsLoggedIn(false);
          setMemberNo(null);
          setMemberNick(null);
          console.log("체크어쓰 에러")
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
        setIsLoggedIn(false);
        setMemberNo(null);
        setMemberNick(null);
        console.log("체크어쓰 캐치에러")
      }
    }, [checkedAuth, refreshAccessToken]);

    const logout = useCallback(() => {
      setIsLoggedIn(false);
      setMemberNo(null);
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
