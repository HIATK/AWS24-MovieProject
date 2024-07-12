'use client'

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import styles from './Modal.module.css';
import { motion } from 'framer-motion'
import { getMovieByMovieId } from "@/movieService";
import { getPostsByMovieId, regPost } from "@/PostService";
import MovieHeader from '@/(components)/MovieHeader';
import PostList from '@/(components)/PostList';
import RatingStars from '@/(components)/RatingStars';
import { useAuth } from "@/(context)/AuthContext"
import { PostDetails, MovieDetails } from "@/(types)/types";

const MovieModal: React.FC = () => {
    const { memberNick } = useAuth(); // useAuth 훅에서 memberNick 추출
    const regDate = ''
    const pathname = usePathname();
    const movieId = parseInt(pathname.split('/').pop() || '0', 10);
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [liked, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [postContent, setPostContent] = useState("");
    const [postRating, setPostRating] = useState(0);
    const [postHoverRating, setPostHoverRating] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const [ratingError, setErrorMsg] = useState("");
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
                const details = await getMovieByMovieId(movieId);
                setMovie(details);
                const fetchedPosts = await getPostsByMovieId(movieId);
                setPost(fetchedPosts);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setError("Failed to load movie details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const handleLike = () => {
        setLiked(!liked);
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let cleanedContent = postContent.replace(/^\s+|\s+$/g, '');
        if (cleanedContent === '') {
            setErrorMsg("글이 비어있습니다");
            return;
        }
        if (postRating === 0 && postContent) {
            setErrorMsg("별점을 선택하세요");
            return;
        }
        setErrorMsg("");
        console.log('멤버닉포스트한다' + memberNick)
        if (memberNick === null) {
            alert('먼저 로그인 해주세요')
            return;
        }
        try {
            await regPost(cleanedContent, postRating, movieId, regDate, memberNick);
            const fetchedPosts = await getPostsByMovieId(movieId);
            setPost(fetchedPosts);
            setPostContent("");
            setPostRating(0);
            setShowRating(false);
        } catch (error) {
            console.error("Post submission error:", error);
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
                                    {ratingError && <div className={styles.ratingError}>{ratingError}</div>}
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
