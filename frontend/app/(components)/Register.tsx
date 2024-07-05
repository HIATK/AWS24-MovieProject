"use client";

import React, { useState } from "react";
import styles from "./Register.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Register = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const movieTitle = ""; // API로부터 불러온 영화 제목

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 게시물 저장 로직
    console.log("Movie Title:", movieTitle);
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Rating:", rating);
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

  const renderStars = () => {
    const stars = [];
    const effectiveRating = hoverRating || rating;
    for (let i = 1; i <= 5; i++) {
      if (effectiveRating >= i) {
        stars.push(
          <FaStar
            key={i}
            className={styles.star + " " + styles.starFilled}
            onMouseEnter={() => handleHover(i)}
            onMouseLeave={handleLeave}
            onClick={() => handleRating(i)}
          />
        );
      } else if (effectiveRating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={styles.star + " " + styles.starHalf}
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
          <input type="file" style={{ display: "none" }} />
        </label>
        <button type="submit" className={styles.button}>
          게시
        </button>
      </form>
    </div>
  );
};

export default Register;