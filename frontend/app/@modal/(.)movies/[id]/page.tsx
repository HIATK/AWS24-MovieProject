'use client'

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from "react";
import styles from './Modal.module.css';
import { motion } from "framer-motion";
import { getMovieById } from "@/MovieService";
import MovieHeader from '@/(components)/MovieHeader';
import PostList from '@/(components)/PostList';
import RatingStars from '@/(components)/RatingStars';
import { getPostsByMovieId } from "@/PostService";

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
    postId: number;
    postContent: string;
    ratingStar: number;
}

const MovieModal: React.FC = () => {
    const pathname = usePathname();
    const id = pathname.split('/').pop(); // Assuming the ID is at the end of the URL path
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [liked, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [postContent, setPostContent] = useState("");
    const [postRating, setPostRating] = useState(0);
    const [postHoverRating, setPostHoverRating] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const [posts, setPosts] = useState<PostDetails[]>([]);

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
                const fetchedPosts = await getPostsByMovieId(id!);
                setPosts(fetchedPosts);
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
        console.log("Post submitted:", { postContent, postRating });
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
                                className={styles.textarea}
                                onFocus={() => setShowRating(true)}
                                onBlur={() => setShowRating(false)}
                            />
                        </label>
                        {showRating && (
                            <div className={styles.ratingAndButton}>
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
                            </div>
                        )}
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
