import React, {useState, useEffect, useRef, ChangeEvent, FormEvent} from "react";
import axios from "axios";
import styles from "./profile.module.css";
import {Member, Errors, UpdateForm} from "@/(types)/types";

// profile 유저 정보 가져오기
const getMemberDetails = async (): Promise<Member> => {
    const response = await axios.get('/api/member/profile', {
        baseURL: 'http://localhost:8000',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        credentials: 'include',
    });
    return response.data;
};

// 정보수정 할 때 입력된 '현재 비밀번호' 서버에 보내서 실제 로그인한 사람의 비밀번호가 맞는지 검증하기.
const verifyPassword = async (password: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      "api/member/verifyPw",
      { password },
      {
        baseURL: "http://localhost:8000",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      }
    );
    return response.data.isValid;
  } catch (error) {
    console.error("Password verification failed", error);
    return false;
  }
};
// 닉네임 중복체크를 위해 입력된 '닉네임' 서버에 보내서 중복되는지 검증
const checkNicknameDuplicate = async (nickname: string): Promise<boolean> => {
  try {
    const response = await axios.get(`/api/member/checkNickname`, {
      params: { nickname },
      baseURL: "http://localhost:8000",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      credentials: "include",
    });
    return response.data.isDuplicate;
  } catch (error) {
    console.error("닉네임 중복 체크 실패", error);
    return false;
  }
};

// 프로필 컴포넌트!
const Profile: React.FC = () => {
    const [member, setMember] = useState<Member>({
        memberNo: 0,
        memberEmail: '',
        memberName: '',
        memberPhone: '',
        memberNick: '',
    });
    const [updateForm, setUpdateForm] = useState<UpdateForm>({
        memberEmail: '',
        memberName: '',
        memberPhone: '',
        memberNick: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState<Errors>({});
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImagePath, setProfileImagePath] = useState("/profile/basic.png"); // 이미지 경로 상태 관리
    let [isNicknameChecked, setIsNicknameChecked] = useState(false);
    let [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);
    // const [reviews, setReviews] = useState<Review[]>([]);
    // const [likedMovies, setLikedMovies] = useState<Movie[]>([]);


  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const data = await getMemberDetails();
        setMember(data);
        console.log(data);
        setUpdateForm((prevForm) => ({
          ...prevForm,
          memberEmail: data.memberEmail,
          memberName: data.memberName,
          memberNick: data.memberNick,
          memberPhone: data.memberPhone,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));

                //  프로필 이미지 경로 가져오기
                const profileImagePathReponse = await axios.get<string>("/api/image/profile", {
                    params: { memberNo: data.memberNo},
                    baseURL: "http://localhost:8000",
                    headers: { "Content-Type": "application/json"},
                    withCredentials: true,
                    credentials: "include",
                });
                setProfileImagePath(`profileImagePathReponse.data`);

            } catch (error) {
                console.error('Failed to fetch member details', error);
            }
        };
        fetchMemberDetails();
    }, []);

    // 정보수정 성공시 페이지에 나타나는 정보도 같이 바뀌도록 설정
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateForm({ ...updateForm, [name]: value });
    };
    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("memberNo", member?.memberNo.toString()); // 멤버 번호 사용

            axios
                .post<string>("/api/image/upload", formData)
                .then((response) => {
                    console.log("이미지가 변경되었습니다.", response.data);
                    setProfileImagePath(response.data); // 서버로부터 반환된 이미지 경로로 설정
                })
                .catch((error) => console.error("이미지 변경에 실패했습니다.", error));
        }
    };

    // 비밀번호 미/오입력시 에러를 나타내는 함수
    const validateForm = (): Errors => {
        const newErrors: Errors = {};
        if (!updateForm.currentPassword) {
            newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
        }
        if (updateForm.newPassword !== updateForm.confirmNewPassword) {
            newErrors.confirmNewPassword = '새 비밀번호가 일치하지 않습니다.';
        }
        return newErrors;
    };
  const handleUpdateProfile = () => {
    setIsEditing(true);
  };

  // 회원정보 수정!!!
  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validateForm();

      // 닉네임을 수정하지 않았다면 닉네임 중복 체크를 하지 않습니다!
      if(updateForm.memberNick == member.memberNick){
          isNicknameChecked = true;
          isNicknameDuplicate= false;
      }

      if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);

      } else if (!isNicknameChecked || isNicknameDuplicate) {
          setErrors({ ...validationErrors, memberNick: '닉네임 중복 체크를 해주세요.' });
      } else {
          try {
              const isPasswordValid = await verifyPassword(updateForm.currentPassword);
              if (!isPasswordValid) {
                  setErrors({ currentPassword: '현재 비밀번호가 올바르지 않습니다.' });
                  return;
              }

              const { currentPassword, confirmNewPassword, ...updateData } = updateForm;

              if (updateForm.newPassword === undefined || updateForm.newPassword === null || updateForm.newPassword === "") {
                  updateForm.newPassword = updateForm.currentPassword;
              }

        const { data } = await axios.put<{ message: string; member: Member }>(
          "/api/member/update",
          {
            ...updateData,
            memberPw: updateForm.newPassword,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
            credentials: "include",
          }
        );
        alert(data.message);
        setMember(data.member);
        setErrors({});
        setIsEditing(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data);
        } else {
          alert("An unexpected error occurred");
        }
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 닉네임 중복체크 버튼
  const handleNicknameCheck = async () => {
    if (updateForm.memberNick != member.memberNick) {
      const isDuplicate = await checkNicknameDuplicate(updateForm.memberNick);
      setIsNicknameDuplicate(isDuplicate);
      setIsNicknameChecked(true);
    } else {
      setIsNicknameChecked(true);
    }
  };

  if (!member) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
            <img
              src={profileImagePath}
              alt="Profile"
              className={styles.profileImageContent}
            />
          </div>
          <div className={styles.nickname}>{member.memberNick}님</div>
          <input
            type="file"
            ref={fileInputRef}
            onClick={() => fileInputRef.current?.click()}
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
          />
          <button
            className={styles.button}
            onClick={() => {
              // click 메서드를 호출하기 전에 null 체크를 수행합니다.
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            프로필 사진 변경
          </button>
          {!isEditing && (
            <button className={styles.button} onClick={handleUpdateProfile}>
              개인정보 수정
            </button>
          )}
          <form
            onSubmit={handleSubmit}
            className={`${styles.editForm} ${isEditing ? styles.visible : ""}`}
          >
            <input
              type="password"
              name="currentPassword"
              placeholder="현재 비밀번호"
              onChange={handleChange}
              required
              className={styles.input}
            />
            {errors.currentPassword && (
              <span style={{ color: "red" }}>{errors.currentPassword}</span>
            )}

            <input
              type="password"
              name="newPassword"
              placeholder="새 비밀번호 (변경 시에만 입력)"
              onChange={handleChange}
              className={styles.input}
            />
            {errors.newPassword && (
              <span style={{ color: "red" }}>{errors.newPassword}</span>
            )}

            <input
              type="password"
              name="confirmNewPassword"
              placeholder="새 비밀번호 확인"
              onChange={handleChange}
              className={styles.input}
            />
            {errors.confirmNewPassword && (
              <span style={{ color: "red" }}>{errors.confirmNewPassword}</span>
            )}

            <input
              type="text"
              name="memberName"
              value={updateForm.memberName}
              onChange={handleChange}
              placeholder="이름"
              className={styles.input}
              required
            />

            <input
              type="text"
              name="memberNick"
              value={updateForm.memberNick}
              onChange={handleChange}
              placeholder="닉네임"
              className={styles.input}
              required
            />

            <button
              type="button"
              onClick={handleNicknameCheck}
              className={styles.button}
            >
              닉네임 중복 체크
            </button>

            {isNicknameChecked && (
              <span style={{ color: isNicknameDuplicate ? "red" : "green" }}>
                {isNicknameDuplicate
                  ? "이미 사용 중인 닉네임입니다."
                  : "사용 가능한 닉네임입니다."}
              </span>
            )}

            {errors.memberNick && (
              <span style={{ color: "red" }}>{errors.memberNick}</span>
            )}

            <input
              type="text"
              name="memberPhone"
              value={updateForm.memberPhone}
              onChange={handleChange}
              placeholder="전화번호"
              className={styles.input}
              required
            />

            <button className={styles.button} type="submit">
              수정 완료
            </button>
          </form>
          {isEditing && (
            <button className={styles.button} onClick={handleCancelEdit}>
              닫기
            </button>
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