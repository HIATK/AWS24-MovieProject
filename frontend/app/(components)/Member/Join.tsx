import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from "./Join.module.css";
import axios from 'axios';
import axiosInstance from '../axiosInstance';

interface FormData {
  memberEmail: string;
  memberPw: string;
  memberPwConfirm: string;
  memberName: string;
  memberPhone: string;
  memberNick: string;
  roleSet: string[];
}

interface Errors {
  memberPwConfirm?: string;
}

const Join: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
      memberEmail: '',
      memberPw: '',
      memberPwConfirm: '',
      memberName: '',
      memberPhone: '',
      memberNick: '',
      roleSet: ['GUEST'],  // roleSet 값을 GUEST로 설정
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const validateForm = (): Errors => {
      const newErrors: Errors = {};
      if (formData.memberPw !== formData.memberPwConfirm) {
          newErrors.memberPwConfirm = '비밀번호가 일치하지 않습니다. !!!';
      }
      return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
    } else {
        try {
            const response = await axiosInstance.post('/api/member/join', formData);
            alert(response.data);
            setFormData({
                memberEmail: '',
                memberPw: '',
                memberPwConfirm: '',
                memberName: '',
                memberPhone: '',
                memberNick: '',
                roleSet: ['GUEST'],
            });
            setErrors({});
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data);
            } else {
                alert('An unexpected error occurred');
            }
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div>
        <input
          type="email"
          name="memberEmail"
          placeholder="Email"
          value={formData.memberEmail}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <input
          type="password"
          name="memberPw"
          placeholder="Password"
          value={formData.memberPw}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="memberPwConfirm"
          placeholder="Confirm Password"
          value={formData.memberPwConfirm}
          onChange={handleChange}
          required
        />
      </div>
      {errors.memberPwConfirm && <span style={{ color: 'red' }}>{errors.memberPwConfirm}</span>}
      <div>
        <input
          type="text"
          name="memberName"
          placeholder="Name"
          value={formData.memberName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          name="memberNick"
          placeholder="Nickname"
          value={formData.memberNick}
          onChange={handleChange}
          required       
        />
      </div>
      <div>
        <input
          type="text"
          name="memberPhone"
          placeholder="Phone('-' 생략)"
          value={formData.memberPhone}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">가입하기</button>
    </form>
  );
};

export default Join;
