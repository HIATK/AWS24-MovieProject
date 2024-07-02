// app/component/RegisterForm.tsx

"use client";

import React, { useState } from "react";
import styles from "./Register.module.css";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ email, name, nick, password, phone, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
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
          placeholder="비밀번호 (영문, 숫자, 10자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          id="confirmPassword"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="name"
          id="name"
          placeholder="성명"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="nick"
          id="nick"
          placeholder="닉네임"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        />
      </div>
      <div>
        <input
          type="phone"
          id="phone"
          placeholder="전화번호 (-자 없이)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <button type="submit">가입하기</button>
    </form>
  );
};

export default RegisterForm;
