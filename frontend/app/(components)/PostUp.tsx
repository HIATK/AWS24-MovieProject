"use client";

import React, { useState } from "react";
import styles from "./PostUp.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Modal from "../(components)/PostModal/Post.Modal"; // 모달 컴포넌트를 임포트합니다.
import axios from 'axios';

const PostUp = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  const movieTitle = ""; // API로부터 불러온 영화 제목

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if(file) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("파일 업로드 성공 : ", file);
    } catch (error) {
      console.error("파일 업로드 실패 : ", error);
    }


    // 게시물 저장 로직
    console.log("Movie Title:", movieTitle);
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Rating:", rating);
    console.log("File:", file);
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleHover = (rate: number) => {
    setHoverRating(rate);
  };

  const handleLeave = () => {
    setHoverRating(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const renderStars = () => {
    const stars = [];
    const effectiveRating = hoverRating || rating;
    for (let i = 1; i <= 5; i++) {
      if (effectiveRating >= i) {
        stars.push(
          <FaStar
            key={i}
            className={`${styles.star} ${styles.starFilled}`}
            onMouseEnter={() => handleHover(i)}
            onMouseLeave={handleLeave}
            onClick={() => handleRating(i)}
          />
        );
      } else if (effectiveRating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={`${styles.star} ${styles.starHalf}`}
            onMouseEnter={() => handleHover(i - 0.5)}
            onMouseLeave={handleLeave}
            onClick={() => handleRating(i - 0.5)}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className={styles.star}
            onMouseEnter={() => handleHover(i)}
            onMouseLeave={handleLeave}
            onClick={() => handleRating(i)}
          />
        );
      }
    }
    return stars;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.label}>
          영화 제목:
          <div>{movieTitle}</div>
        </div>
        <div className={styles.starRating}>{renderStars()}</div>
        <label className={styles.label}>
          제목
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          내용
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          />
        </label>
        <label className={styles.fileUpload}>
          파일 첨부
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        <div className={styles.buttonContainer}>
          <button type='submit' className={styles.button}>
            게시
          </button>
          <button type="button" className={styles.button} onClick={openModal}>
            Open Modal
          </button>
        </div>
      </form>
      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
};

export default PostUp;
