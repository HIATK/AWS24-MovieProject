'use client'
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import styles from './Modal.module.css';
import { motion } from "framer-motion";
import { getMovieById } from "@/movieService";
import { getPostsByMovieId } from "@/PostService";
import { submitPost } from "@/PostService";
import MovieHeader from '@/(components)/MovieHeader';
import PostList from '@/(components)/PostList';
import RatingStars from '@/(components)/RatingStars';
import axios from 'axios';

interface MovieDetails {
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    runtime: number;
    genres: { name: string }[];
}

interface PostDetails {
    movieId : string;
    postId: string;
    postContent: string;
    ratingStar: number;
}

const MovieModal: React.FC = () => {
    const pathname = usePathname();
    const id = parseInt(pathname.split('/').pop() || '0',10);
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [liked, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [postContent, setPostContent] = useState("");
    const [postRating, setPostRating] = useState(1);
    const [postHoverRating, setPostHoverRating] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const [posts, setPost] = useState<PostDetails[]>([]);

    const closeModal = () => {
        window.history.back();
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const details = await getMovieById(id!);
                setMovie(details);
                // 이거 써서 새로고침같은거 사용
                const fetchedPosts = await getPostsByMovieId(id!);
                setPost(fetchedPosts);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setError("Failed to load movie details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const handleLike = () => {
        setLiked(!liked);
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id === 0) {
            console.error("유효하지 않은 영화 ID");
            return;
        }
        try {
            const newPost = await submitPost(postContent, postRating, id);
            setPost(prevPosts => [newPost, ...prevPosts]); // 새 게시글을 목록의 맨 앞에 추가
            setPostContent(""); // 텍스트 입력란 비우기
            setPostRating(1); // 평점 초기화
            setShowRating(false); // 평점 입력 UI 숨기기
        } catch (error) {
            console.error("전송에러:", error);
        }
    };

    if (isLoading) {
        return <div className={styles.modalOverlay}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.modalOverlay}>{error}</div>;
    }

    if (!movie) {
        return <div className={styles.modalOverlay}>Movie information not available</div>;
    }

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <motion.div
                className={styles.modalContent}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeButton} onClick={closeModal}>X</button>
                <div className={styles.content}>
                    <MovieHeader movie={movie} liked={liked} onLike={handleLike} />
                    <form onSubmit={handlePostSubmit} className={styles.form}>
                        <label className={styles.label}>
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className={`${styles.textarea} ${postContent ? styles.expandedTextarea : ''}`}
                                onFocus={() => setShowRating(true)}
                            />
                        </label>
                        <div className={styles.ratingAndButton}>
                            {showRating && (
                                <>
                                    <RatingStars
                                        rating={postRating}
                                        hoverRating={postHoverRating}
                                        onHover={setPostHoverRating}
                                        onClick={setPostRating}
                                    />
                                    <div className={styles.buttonContainer}>
                                        <button type='submit' className={styles.button}>
                                            게시
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                    <div className={styles.postListWrapper}>
                        <PostList posts={posts} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MovieModal;