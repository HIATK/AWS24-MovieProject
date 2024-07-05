import React, { useEffect, useState } from 'react';
import {getMemberDetails} from "@/(components)/memberServices";


interface Member {
    memberEmail: string;
    memberPw: string;
    memberPwConfirm: string;
    memberName: string;
    memberPhone: string;
    memberNick: string;
    roleSet: string[];
}

interface Movie {

}

const Mypage: React.FC = () => {
    const [member, setMember] = useState<Member | null>(null);
    // const [likeMovies, setLikeMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const data = await getMemberDetails();
                setMember(data);
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
                <h2>Member Info</h2>
                <p>EMAIL: {member.memberEmail}</p>
                <p>NICKNAME: {member.memberNick}</p>
                <button>Edit Info</button>
            </div>
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

export default Mypage;
