// app/component/RegisterForm.tsx

"use client";

import React, { useState } from "react";
import styles from "./RegisterForm.module.css";

const RegisterForm: React.FC = () => {
  const [id, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ id, email, password, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div>
        <input
          type="text"
          id="username"
          placeholder="아이디 (2자 이상)"
          value={id}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="email"
          id="email"
          placeholder="이메일 (example@gmail.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          id="password"
          placeholder="비밀번호 (영문, 숫자, 특문 중 2개 조합 10자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        {/* <label htmlFor="confirmPassword">비밀번호 확인</label> */}
        <input
          type="password"
          id="confirmPassword"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit">가입하기</button>
    </form>
  );
};

export default RegisterForm;
