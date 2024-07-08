import React, { useState, useEffect } from "react";
import styles from "./Post.Modal.module.css";
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

const Modal: React.FC<ModalProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const details = await getMovieById(movieId);
        setMovie(details);
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
    <div className={styles.modalOverlay}>
      <motion.div
        className={styles.modalContent}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className={styles.closeButton} onClick={onClose}>
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

export default Modal;
