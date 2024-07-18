import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./profile.module.css";
import { Member, MovieDetails, PostDetails } from "@/(types)/types";
import { useAuth } from '@/(context)/AuthContext';
import { getMemberDetails } from "@/_Service/MemberService";
import { getLikedMovies, getMovieByMovieId } from "@/_Service/MovieService";
import { getPostsByMemberNo } from "@/_Service/PostService";
import Update from "@/(components)/Profile/Update/Update";
import LikeList from "@/(components)/Profile/LikeList/LikeList";
import ProfilePostList from "@/(components)/Profile/ProfilePostList/ProfilePostList";

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
    const [profileImageUrl, setProfileImageUrl] = useState<string>("/profile/basic.png");


    const updateProfileImage = async (memberNo: number) => {
        const newImageUrl = await fetchImage(memberNo);
        setProfileImageUrl(newImageUrl);
    };


    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const data = await getMemberDetails();
                setMember(data);

                const likedMovies = await getLikedMovies(data.memberNo);
                const postData = await getPostsByMemberNo(data.memberNo);
                setPosts(postData);

                const imageUrl = await fetchImage(data.memberNo);
                setProfileImageUrl(imageUrl);

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

    const fetchImage = async (memberNo: number): Promise<string> => {
        try {
            const response = await axios.get(`/api/image/read/${memberNo}`, {
                responseType: "blob",
            });

            if (response.data) {
                return URL.createObjectURL(response.data);
            }
        } catch (error) {
            console.error("이미지 조회 실패", error);
        }
        return "/profile/basic.png";
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <Update
                    member={member}
                    setMember={setMember}
                    fetchImage={fetchImage}
                    profileImageUrl={profileImageUrl}
                    setProfileImageUrl={setProfileImageUrl}
                    updateProfileImage={updateProfileImage}  // 새로 추가된 prop
                />
                <div className={styles.contentSection}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>내가 남긴 리뷰</h2>
                            <ProfilePostList posts={posts}/>
                    </div>
                    <LikeList movies={movies}/>
                </div>
            </div>
        </div>
    );
};

export default Profile;