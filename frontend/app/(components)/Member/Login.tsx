'use client';

import React, { useState, useRef } from 'react';
import styles from './Login.module.css';
import Link from 'next/link';
import { useAuth } from '../util/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ email, password });

    const loginData = { username: email, password };

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        alert('로그인 성공!');

        setIsLoggedIn(true);

        // 리디렉션하거나 추가 동작을 수행할 수 있습니다.
      } else if (response.status === 401) {
        alert('아이디 혹은 비밀번호가 올바르지 않습니다');
      } else {
        throw new Error('로그인 에러');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2>로그인</h2>
        <div>
          <input
            type='email'
            id='email'
            placeholder='이메일(example@gmail.com)'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type='password'
            id='password'
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type='submit'>로그인</button>
        <div className={styles.socialLogin}>
          <p>다른 방법으로 로그인하기</p>
          <div className={styles.icons}>
            <a href='http://localhost:8000/oauth2/authorization/kakao'>
              <img src='/images/kakao.png' alt='KAKAO' />
            </a>
            <Link href='#'>
              <img src='/images/google.png' alt='Google' />
            </Link>
            <Link href='http://localhost:8000/oauth2/authorization/naver'>
              <img src='/images/naver.png' alt='Naver' />
            </Link>
          </div>
        </div>
        <Link href='../../member/join'>회원가입</Link>
      </form>
      <Link href='/'>
        <button ref={loginButtonRef} style={{ display: 'none' }} />
      </Link>
    </div>
  );
};

export default Login;
