// app/@modal/movies/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import styles from '@/(components)/PostModal/PostModal.module.css';
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { getMovieById } from "@/movieService";

interface ModalProps {
    movieId: string;
    onClose: () => void;
}

interface MovieDetails {
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    runtime: number;
    genres: { name: string }[];
}

const MovieModal: React.FC = () => {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [liked, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                const details = await getMovieById(id);
                setMovie(details);
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

    if (isLoading) {
        return <div className={styles.modalOverlay}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.modalOverlay}>{error}</div>;
    }

    if (!movie) {
        return (
            <div className={styles.modalOverlay}>Movie information not available</div>
        );
    }

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <motion.div
                className={styles.modalContent}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()} // This stops the click from propagating to the overlay
            >
                <button className={styles.closeButton} onClick={closeModal}>
                    X
                </button>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={`Poster for ${movie.title}`}
                            className={styles.poster}
                        />
                        <div className={styles.movieInfo}>
                            <h1>{movie.title}</h1>
                            <h2>
                                {movie.release_date} ·{" "}
                                {movie.genres?.map((g) => g.name).join(", ") ||
                                    "장르 정보 없음"}{" "}
                                · {movie.runtime ? `${movie.runtime}분` : "상영 시간 정보 없음"}
                            </h2>
                            <p>{movie.overview}</p>
                            <button
                                className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
                                onClick={handleLike}
                            >
                                <FaHeart /> {liked ? "좋아요 취소" : "좋아요"}
                            </button>
                        </div>
                    </div>
                    <div className={styles.posts}>
                        <div className={styles.commentHeader}>
                            게시글
                            <button className={styles.writeButton}>새 게시글</button>
                        </div>
                        {/* 여기에 게시글 목록을 추가할 수 있습니다 */}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MovieModal;