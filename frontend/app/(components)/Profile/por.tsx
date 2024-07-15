import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import axios from "axios";
import styles from "./profile.module.css";
import { Member, UpdateForm, Posts, Likes } from "@/(types)/types";
import { useAuth } from '@/(context)/AuthContext';
import { checkNicknameDuplicate, getMemberDetails, verifyPassword } from "@/_Service/MemberService";

const Profile: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [member, setMember] = useState<Member>({
        memberNo: 0,
        memberEmail: '',
        memberName: '',
        memberPhone: '',
        memberNick: '',
    });
    const [profileImagePath, setProfileImagePath] = useState("/profile/basic.png");
    const [updateForm, setUpdateForm] = useState<UpdateForm>({ /* ... */ });
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchMemberDetails();
        }
    }, [isLoggedIn]);

    const fetchMemberDetails = async () => {
        try {
            const data = await getMemberDetails();
            setMember(data);
            fetchImage(data.memberNo);
        } catch (error) {
            console.error('데이터 가져오기 실패', error);
        }
    };

    const fetchImage = async (memberNo: number) => {
        try {
            const response = await axios.get(`/api/image/read/${memberNo}`, {
                responseType: 'blob'
            });
            const imageUrl = URL.createObjectURL(response.data);
            setProfileImagePath(imageUrl);
        } catch (error) {
            console.error("이미지 조회 실패", error);
            setProfileImagePath("/profile/basic.png");
        }
    };

    const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("memberNo", member.memberNo.toString());

            try {
                const response = await axios.post<{ filePath: string }>("/api/image/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setProfileImagePath(response.data.filePath);
            } catch (error) {
                console.error("이미지 업로드 실패", error);
            }
        }
    };

    const handleProfileImageDelete = async () => {
        try {
            await axios.delete(`/api/image/delete/${member.memberNo}`);
            setProfileImagePath("/profile/basic.png");
        } catch (error) {
            console.error("이미지 삭제 실패", error);
        }
    };

    // ... 기존의 다른 함수들 (handleChange, handleSubmit 등)

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.profileSection}>
                    <div className={styles.profileImage}>
                        <img
                            src={profileImagePath}
                            alt="Profile"
                            className={styles.profileImageContent}
                            onError={(e) => {
                                e.currentTarget.src = "/profile/basic.png";
                            }}
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
                    <button
                        className={styles.button}
                        onClick={handleProfileImageDelete}
                    >
                        프로필 사진 삭제
                    </button>
                    {/* ... 나머지 UI 코드 */}
                </div>
                {/* ... 나머지 컴포넌트 코드 */}
            </div>
        </div>
    );
};

export default Profile;