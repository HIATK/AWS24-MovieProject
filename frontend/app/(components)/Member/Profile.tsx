import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Profile.module.css";

interface Member {
  memberNo: number;
  memberEmail: string;
  memberName: string;
  memberNick: string;
  memberPhone: string;
}

const Profile: React.FC = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await axios.get<Member>("api/member/profile", {
          baseURL: "http://localhost:8000",
          withCredentials: true,
        });
        setMember(response.data);
        setNewName(response.data.memberName);
        setNewNickname(response.data.memberNick);
        setNewPhone(response.data.memberPhone);
      } catch (error) {
        console.error("Failed to fetch member details", error);
      }
    };

    fetchMemberDetails();
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("profileImage", file);
      axios
        .post("/api/profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log("Profile image updated", response.data);
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
    if (member) {
      axios
        .post("/api/update-profile", {
          memberNo: member.memberNo,
          currentPassword,
          newPassword,
          newPasswordConfirm,
          memberName: newName,
          memberNick: newNickname,
          memberPhone: newPhone,
        })
        .then((response) => {
          console.log("Profile updated", response.data);
          setMember({
            ...member,
            memberName: newName,
            memberNick: newNickname,
            memberPhone: newPhone,
          });
          setIsEditing(false);
        })
        .catch((error) => console.error("Error updating profile:", error));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (!member) return <div className={styles.container}>Loading...</div>;

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
          <div className={styles.nickname}>{member.memberNick}님</div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
          />
          <button
            className={styles.button}
            onClick={() => fileInputRef.current?.click()}
          >
            프로필 사진 변경
          </button>
          {!isEditing && (
            <button className={styles.button} onClick={handleUpdateProfile}>
              개인정보 수정
            </button>
          )}
          {isEditing && (
            <>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호"
                className={styles.input}
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호"
                className={styles.input}
              />
              <input
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="새 비밀번호 확인"
                className={styles.input}
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="이름"
                className={styles.input}
              />
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                placeholder="닉네임"
                className={styles.input}
              />
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="전화번호"
                className={styles.input}
              />
              <button className={styles.button} onClick={handleSaveProfile}>
                수정 완료
              </button>
              <button className={styles.button} onClick={handleCancelEdit}>
                닫기
              </button>
            </>
          )}
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
