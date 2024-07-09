import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import axios from "axios";
import styles from './Update.module.css';

interface Member {
    memberEmail: string;
    memberPw: string;
    memberPwConfirm: string;
    memberName: string;
    memberPhone: string;
    memberNick: string;
}

interface Errors {
    memberPwConfirm?: string;
}

const getMemberDetails = async (): Promise<Member> => {
    const response = await axios.get('api/member/profile', {
        baseURL: 'http://localhost:8000',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        credentials: 'include',
    });
    return response.data;
};

const Profile: React.FC = () => {
    const [member, setMember] = useState<Member>({
        memberEmail: '',
        memberPw: '',
        memberPwConfirm: '',
        memberName: '',
        memberPhone: '',
        memberNick: '',
    });
    const [errors, setErrors] = useState<Errors>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const data = await getMemberDetails();
                setMember(data);
            } catch (error) {
                console.error('Failed to fetch member details', error);
            }
        };
        fetchMemberDetails();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMember({ ...member, [e.target.name]: e.target.value });
    };

    const validateForm = (): Errors => {
        const newErrors: Errors = {};
        if (member.memberPw !== member.memberPwConfirm) {
            newErrors.memberPwConfirm = '비밀번호가 일치하지 않습니다.';
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
                const response = await axios.put('/api/member/update', member, {
                    headers: { 'Content-Type': 'application/json' },
                });
                alert(response.data);
                console.log(response.data);
                setMember({
                    memberEmail: '',
                    memberPw: '',
                    memberPwConfirm: '',
                    memberName: '',
                    memberPhone: '',
                    memberNick: '',
                    roleSet: ['GUEST'],
                });
                setErrors({});
                setIsModalOpen(false);
                const fetchMemberDetails = async () => {
                    try {
                        const data = await getMemberDetails();
                        setMember(data);
                    } catch (error) {
                        console.error('Failed to fetch member details', error);
                    }
                };
                fetchMemberDetails();

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    alert(error.response.data);
                } else {
                    alert('An unexpected error occurred');
                }
            }
        }
    };

    const handleUpdateClick = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    if (!member) return <div>Loading...</div>;

    return (
        <div>
            <h1>Profile</h1>
            <hr/>
            <div>
                <h2>{member.memberName}({member.memberNick})님 환영합니다.</h2>
                <button onClick={handleUpdateClick}>정보 수정</button>
            </div>
            <hr/>
            <div>
                <h2>Like Movies</h2>
                <ul>{/* 좋아하는 영화 목록 렌더링 */}</ul>
            </div>
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>회원 정보 수정</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input type="password" name="memberPw" placeholder="비밀번호" onChange={handleChange} required />
                            </div>
                            <div>
                                <input type="password" name="memberPwConfirm" placeholder="비밀번호 확인" onChange={handleChange} required />
                            </div>
                            {errors.memberPwConfirm && <span style={{color: 'red'}}>{errors.memberPwConfirm}</span>}
                            <div>
                                <input type="text" name="memberName" placeholder={member.memberName} onChange={handleChange} required />
                            </div>
                            <div>
                                <input type="text" name="memberPhone" placeholder={member.memberPhone} onChange={handleChange} required />
                            </div>
                            <div>
                                <input type="text" name="memberNick" placeholder={member.memberNick} onChange={handleChange} required />
                            </div>
                            <button type="submit">수정 완료</button>
                        </form>
                        <button onClick={handleCloseModal}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;