import React, { useEffect, useState } from 'react';
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8000', // 백엔드 API URL에 맞게 설정
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    credentials: 'include'
});

interface Member {
    memberEmail: string;
    memberPw: string;
    memberName: string;
    memberPhone: string;
    memberNick: string;
    roleSet: string[];
}

interface Movie {

}

const getMemberDetails = async () => {
    const response = await instance.get('api/member/profile', { withCredentials: true, credentials: 'include' });
    return response.data;
};

// const getLikeMovies = async () => {
//     const response = await instance.get(`api/member/likes`, { withCredentials: true, credentials: 'include' });
//     return response.data;
// };


const Profile: React.FC = () => {
    const [member, setMember] = useState<Member | null>(null);
    // const [likeMovies, setLikeMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const data = await getMemberDetails();
                setMember(data);
                console.log("데이터 !!!"+data)
            } catch (error) {
                console.error('Failed to fetch member details', error);
            }
        };

        // const fetchLikeMovies = async () => {
        //     try {
        //         const data = await getLikeMovies();
        //         setLikeMovies(data);
        //     } catch (error) {
        //         console.error('Failed to fetch like movies', error);
        //     }
        // };

        fetchMemberDetails();
        // fetchLikeMovies();
    }, []);

    if (!member) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>My Page</h1>
            <div>
                <h2>회원 정보</h2>
                <p>EMAIL: {member.memberEmail}</p>
                <p>NAME: {member.memberName}</p>
                <p>PHONE: {member.memberPhone}</p>
                <p>NICKNAME: {member.memberNick}</p>
                <button>정보 수정</button>
            </div>
            <hr/>
            <div>
                <h2>Like Movies</h2>
                <ul>
                    {/*{likeMovies.map(movie => (*/}
                    {/*    <li key={movie.id}>*/}
                    {/*        <img src={movie.posterUrl} alt={movie.title} />*/}
                    {/*        <p>{movie.title}</p>*/}
                    {/*    </li>*/}
                    {/*))}*/}
                </ul>
            </div>
        </div>
    );
};

export default Profile;
