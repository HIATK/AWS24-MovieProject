import React, { useEffect, useState } from 'react';
import {getFavoriteMovies, getMemberDetails} from "@/app/components/memberServices";

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
    // const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const data = await getMemberDetails();
                setMember(data);
            } catch (error) {
                console.error('Failed to fetch member details', error);
            }
        };

        // const fetchFavoriteMovies = async () => {
        //     try {
        //         const data = await getFavoriteMovies();
        //         setFavoriteMovies(data);
        //     } catch (error) {
        //         console.error('Failed to fetch favorite movies', error);
        //     }
        // };

        fetchMemberDetails();
        // fetchFavoriteMovies();
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
                <h2>Favorite Movies</h2>
                <ul>
                    {/*{favoriteMovies.map(movie => (*/}
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
