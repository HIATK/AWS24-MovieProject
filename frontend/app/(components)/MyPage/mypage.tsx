import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./mypage.module.css";

interface User {
  memberNo: number;
  memberEmail: string;
  memberPw: string;
  memberName: string;
  memberPhone: string;
  memberNick: string;
  roleSet: Set<string>;
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [newNickname, setNewNickname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Fetch user information
    axios
      .get<User>("/api/user-info")
      .then((response) => {
        setUser(response.data);
        setNewNickname(response.data.memberNick);
        setNewEmail(response.data.memberEmail);
      })
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
      const file = e.target.files[0];
      setProfileImage(file);
      const formData = new FormData();
      formData.append("profileImage", file);
      axios
        .post("/api/profile-image", formData)
        .then((response) => {
          console.log("Profile image updated", response.data);
          // 새로고침
          window.location.reload();
        })
        .catch((error) =>
          console.error("Error updating profile image:", error)
        );
    }
  };

  const handleUpdateProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (user) {
      axios
        .post("/api/update-profile", {
          memberNo: user.memberNo,
          memberNick: newNickname,
          memberEmail: newEmail,
        })
        .then((response) => {
          console.log("Profile updated", response.data);
          setUser((prevUser) => {
            if (prevUser) {
              return {
                ...prevUser,
                memberNick: newNickname,
                memberEmail: newEmail,
              };
            }
            return prevUser;
          });
          // 새로고침
          window.location.reload();
        })
        .catch((error) => console.error("Error updating profile:", error));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.profileImage}>
          <img
            src="/profile/basic.png"
            alt="Profile"
            className={styles.profileImageContent}
          />
        </div>
        <div className={styles.nickname}>{user?.memberNick}님</div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfileImageChange}
          className={styles.hiddenFileInput}
        />
        <button
          className={styles.button}
          onClick={() => fileInputRef.current?.click()}
        >
          프로필 사진 변경
        </button>
        {isEditing && (
          <>
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
            <button className={styles.button} onClick={handleSaveProfile}>
              저장
            </button>
          </>
        )}
        {!isEditing && (
          <button className={styles.button} onClick={handleUpdateProfile}>
            개인 정보 수정
          </button>
        )}
      </div>
      <div className={styles.contentSection}>
        <div className={`${styles.section} ${styles.reviewSection}`}>
          <h2>내가 남긴 리뷰</h2>
          {reviews.map((review) => (
            <div key={review.id} className={styles.review}>
              {review.content}
            </div>
          ))}
        </div>
        <div className={`${styles.section} ${styles.likedMoviesSection}`}>
          <h2>좋아요 누른 영화</h2>
          {likedMovies.map((movie) => (
            <div key={movie.id} className={styles.movie}>
              {movie.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
