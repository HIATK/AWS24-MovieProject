'use client';

import React, { useState, useEffect, useRef, type ElementRef } from "react";
import styles from '@/@modal/(.)movies/details/[movieId]/MovieModal.module.css';
import { motion } from 'framer-motion';
import { getMovieByMovieId } from "@/MovieService";
import { getPostsByMovieId, regPost } from "@/PostService";
import MovieHeader from '@/(components)/Modal/MovieHeader/MovieHeader';
import PostList from '@/(components)/Modal/PostList/PostList';
import RatingStars from '@/(components)/Modal/RatingStar/RatingStars';
import { useAuth } from "@/(context)/AuthContext";
import { PostDetails, MovieDetails } from "@/(types)/types";
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

const MovieModal: React.FC<{ movieId: string }> = ({ movieId }) => {
    const numericMovieId = parseInt(movieId, 10);
    const { memberNick } = useAuth();
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
    const router = useRouter();
    const dialogRef = useRef<ElementRef<'dialog'>>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, [isClient]);

    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        router.back();
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
                const details = await getMovieByMovieId(numericMovieId);
                setMovie(details);
                const fetchedPosts = await getPostsByMovieId(numericMovieId);
                setPost(fetchedPosts);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setError("Failed to load movie details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [numericMovieId]);

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
        if (memberNick === null) {
            alert('먼저 로그인 해주세요');
            return;
        }
        try {
            await regPost(cleanedContent, postRating, numericMovieId, '', memberNick);
            const fetchedPosts = await getPostsByMovieId(numericMovieId);
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

    if (!isClient) {
        return null;
    }

    return createPortal(
        <div className={styles.modalBackdrop} onClick={handleOverlayClick}>
            <dialog ref={dialogRef} className={styles.dialog} style={{ display: 'block' }}>
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
            </dialog>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default MovieModal;