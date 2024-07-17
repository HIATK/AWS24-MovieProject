import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./profile.module.css";
import { Member, MovieDetails, PostDetails } from "@/(types)/types";
import { useAuth } from '@/(context)/AuthContext';
import { getMemberDetails } from "@/_Service/MemberService";
import { getLikedMovies, getMovieByMovieId } from "@/_Service/MovieService";
import { getPostsByMemberNo } from "@/_Service/PostService";
import Update from "@/(components)/Profile/Update/Updata";
import PostList from "@/(components)/Profile/PostList/PostList";
import LikeList from "@/(components)/Profile/LikeList/LikeList";

const Profile: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [member, setMember] = useState<Member>({
        memberNo: 0,
        memberEmail: '',
        memberName: '',
        memberPhone: '',
        memberNick: '',
    });
    const [posts, setPosts] = useState<PostDetails[]>([]);
    const [movies, setMovies] = useState<MovieDetails[] | null>(null);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const data = await getMemberDetails();
                setMember(data);

                const likedMovies = await getLikedMovies(data.memberNo);
                const postData = await getPostsByMemberNo(data.memberNo);
                setPosts(postData);

                await fetchImage(data.memberNo);

                const movieDetailsPromises = likedMovies.map(movieId => getMovieByMovieId(movieId));
                const movieDetails = await Promise.all(movieDetailsPromises);
                setMovies(movieDetails.filter((movie): movie is MovieDetails => movie !== null));
            } catch (error) {
                console.error('데이터 가져오기 실패', error);
            }
        };

        if (isLoggedIn) {
            fetchMemberDetails();
        }
    }, [isLoggedIn]);

    const fetchImage = async (memberNo: number) => {
        try {
            const response = await axios.get(`/api/image/read/${memberNo}`, {
                responseType: "blob",
            });

            if (response.data) {
                const imageUrl = URL.createObjectURL(response.data);
                // 여기서 이미지 URL을 사용할 수 있습니다.
            }
        } catch (error) {
            console.error("이미지 조회 실패", error);
        }
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <Update member={member} setMember={setMember} fetchImage={fetchImage} />
                <div className={styles.contentSection}>
                    <PostList posts={posts} />
                    <LikeList movies={movies} />
                </div>
            </div>
        </div>
  );
};

export default Profile;