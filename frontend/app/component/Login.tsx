// app/login/Login.tsx

"use client";

import React, { useState } from "react";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ email, password });

    // POST 요청을 보낼 데이터를 준비합니다.
    const loginData = { username: email, password };

    try {
      // POST 요청을 보냅니다.
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        // 로그인 성공 후 처리할 로직을 추가합니다.
      } else {
        console.error("Login failed");
        // 로그인 실패 시 처리할 로직을 추가합니다.
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2>로그인</h2>
        <div>
          <input
            type="email"
            id="email"
            placeholder="이메일(example@gmail.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">로그인</button>
        <div className={styles.socialLogin}>
          <p>다른 방법으로 로그인하기</p>
          <div className={styles.icons}>
            <img src="/images/kakao.png" alt="Kakao" />
            <img src="/images/google.png" alt="Google" />
            <img src="/images/naver.png" alt="Naver" />
          </div>
        </div>
        <a href="#">회원가입</a>
      </form>
    </div>
  );
};

export default Login;
