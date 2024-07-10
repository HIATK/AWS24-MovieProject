import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Profile.module.css";

interface Member {
  memberNo: number;
  memberEmail: string;
  memberName: string;
  memberNick: string;
}

const Profile: React.FC = () => {
  const [member, setMember] = useState<Member | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await axios.get<Member>("api/member/profile", {
          baseURL: "http://localhost:8000",
          withCredentials: true,
        });
        setMember(response.data);
      } catch (error) {
        console.error("Failed to fetch member details", error);
      }
    };

    fetchMemberDetails();
  }, []);

  const handleProfileImageChange = () => {
    fileInputRef.current?.click();
  };

  if (!member) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
            <img
              src="/profile/basic.png"
              alt="Profile"
              className={styles.profileImageContent}
            />
          </div>
          <div className={styles.nickname}>{member.memberNick}</div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
          />
          <button className={styles.button} onClick={handleProfileImageChange}>
            프로필 사진 변경
          </button>
          <button className={styles.button}>새 닉네임</button>
          <button className={styles.button}>새 이메일</button>
          <button className={styles.button}>저장</button>
        </div>
        <div className={styles.contentSection}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>내가 남긴 리뷰</h2>
            {/* 리뷰 내용 */}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>좋아요 누른 영화</h2>
            {/* 좋아요 누른 영화 목록 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
