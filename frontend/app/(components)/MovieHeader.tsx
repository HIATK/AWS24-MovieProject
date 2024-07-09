import React from 'react';
import styles from './MovieHeader.module.css';
import { FaHeart } from "react-icons/fa";

interface MovieDetails {
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    runtime: number;
    genres: { name: string }[];
}

interface MovieHeaderProps {
    movie: MovieDetails;
    liked: boolean;
    onLike: () => void;
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ movie, liked, onLike }) => {
    return (
        <div className={styles.header}>
            <div className={styles.posterWrapper}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`Poster for ${movie.title}`}
                    className={styles.poster}
                />
            </div>
            <div className={styles.movieInfo}>
                <h1>{movie.title}</h1>
                <h2>
                    {movie.release_date} ·{" "}
                    {movie.genres?.map((g) => g.name).join(", ") || "장르 정보 없음"}{" "}
                    · {movie.runtime ? `${movie.runtime}분` : "상영 시간 정보 없음"}
                </h2>
                <p>{movie.overview}</p>
                <button
                    className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
                    onClick={onLike}
                >
                    <FaHeart /> {liked ? "좋아요 취소" : "좋아요"}
                </button>
            </div>
        </div>
    );
};

export default MovieHeader;
