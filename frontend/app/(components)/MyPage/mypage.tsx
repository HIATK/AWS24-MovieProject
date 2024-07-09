"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./mypage.module.css";

const MyPage: React.FC = () => {
  const [reviews, setReviews] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [newNickname, setNewNickname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    // Fetch user information
    axios
      .get("/api/user-info")
      .then((response) => setUserNickname(response.data.nickname))
      .catch((error) => console.error("Error fetching user info:", error));

    // Fetch initial data for reviews and liked movies
    axios
      .get("/api/reviews")
      .then((response) => setReviews(response.data))
      .catch((error) => console.error("Error fetching reviews:", error));

    axios
      .get("/api/liked-movies")
      .then((response) => setLikedMovies(response.data))
      .catch((error) => console.error("Error fetching liked movies:", error));
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleProfileImageUpload = () => {
    if (profileImage) {
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      axios
        .post("/api/profile-image", formData)
        .then((response) => {
          console.log("Profile image updated", response.data);
        })
        .catch((error) =>
          console.error("Error updating profile image:", error)
        );
    }
  };

  const handleUpdateProfile = () => {
    axios
      .post("/api/update-profile", { nickname: newNickname, email: newEmail })
      .then((response) => {
        console.log("Profile updated", response.data);
        setNewNickname("");
        setNewEmail("");
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  const handleLikeMovie = (movieId: number) => {
    axios
      .post(`/api/movies/${movieId}/like`)
      .then((response) => setLikedMovies([...likedMovies, response.data]))
      .catch((error) => console.error("Error liking movie:", error));
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.profileImage}></div>
        <div className={styles.nickname}>{userNickname}님</div>
        <input type="file" onChange={handleProfileImageChange} />
        <button className={styles.button} onClick={handleProfileImageUpload}>
          프로필 사진 변경
        </button>
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="새 닉네임"
          className={styles.input}
        />
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="새 이메일"
          className={styles.input}
        />
        <button className={styles.button} onClick={handleUpdateProfile}>
          개인 정보 수정
        </button>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.reviewSection}>
          <h2>내가 남긴 리뷰</h2>
          {reviews.map((review) => (
            <div key={review.id} className={styles.review}>
              {review.content}
            </div>
          ))}
        </div>
        <div className={styles.likedMoviesSection}>
          <h2>좋아요 누른 영화</h2>
          {likedMovies.map((movie) => (
            <div key={movie.id} className={styles.movie}>
              {movie.title}
              <button
                className={styles.button}
                onClick={() => handleLikeMovie(movie.id)}
              >
                좋아요
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
