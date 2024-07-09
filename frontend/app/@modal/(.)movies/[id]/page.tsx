'use client'

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import styles from './PostModal.module.css';
import { motion } from "framer-motion";
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { getMovieById } from "@/movieService";
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

const MovieModal: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [liked, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [postRating, setPostRating] = useState(0);
    const [postHoverRating, setPostHoverRating] = useState(0);
    const [file, setFile] = useState<File | null>(null);

    const closeModal = () => {
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

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Post submitted:", { postTitle, postContent, postRating, file });
        // 여기에 게시글 제출 로직 추가
        // 게시글 목록을 새로고침하거나 업데이트하는 로직 추가
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const renderStars = () => {
        const stars = [];
        const effectiveRating = postHoverRating || postRating;
        for (let i = 1; i <= 5; i++) {
            if (effectiveRating >= i) {
                stars.push(
                    <FaStar
                        key={i}
                        className={`${styles.star} ${styles.starFilled}`}
                        onMouseEnter={() => setPostHoverRating(i)}
                        onMouseLeave={() => setPostHoverRating(0)}
                        onClick={() => setPostRating(i)}
                    />
                );
            } else if (effectiveRating >= i - 0.5) {
                stars.push(
                    <FaStarHalfAlt
                        key={i}
                        className={`${styles.star} ${styles.starHalf}`}
                        onMouseEnter={() => setPostHoverRating(i - 0.5)}
                        onMouseLeave={() => setPostHoverRating(0)}
                        onClick={() => setPostRating(i - 0.5)}
                    />
                );
            } else {
                stars.push(
                    <FaRegStar
                        key={i}
                        className={styles.star}
                        onMouseEnter={() => setPostHoverRating(i)}
                        onMouseLeave={() => setPostHoverRating(0)}
                        onClick={() => setPostRating(i)}
                    />
                );
            }
        }
        return stars;
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
                    <form onSubmit={handlePostSubmit} className={styles.form}>
                        <div className={styles.label}>
                            영화 제목:
                            <div>{movie.title}</div>
                        </div>
                        <div className={styles.starRating}>{renderStars()}</div>
                        <label className={styles.label}>
                            제목
                            <input
                                type="text"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.label}>
                            내용
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className={styles.textarea}
                            />
                        </label>
                        <label className={styles.fileUpload}>
                            파일 첨부
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                        </label>
                        <div className={styles.buttonContainer}>
                            <button type='submit' className={styles.button}>
                                게시
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default MovieModal;