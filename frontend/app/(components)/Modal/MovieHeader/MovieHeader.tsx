import React, { useState, useEffect } from "react";
import styles from "./MovieHeader.module.css";
import { FaHeart, FaStar } from "react-icons/fa"; // FaStar 아이콘 추가
import { MovieDetails } from "@/(types)/types";
import { useAuth } from "@/(context)/AuthContext";
import { fetchLikeStatus, updateLikeStatus } from "@/_Service/LikeService";
import { getAverageRatingByMovieId } from "@/_Service/PostService"; // 필요한 import 추가
import { getVideosByMovieId } from "@/_Service/MovieService";

interface MovieHeaderProps {
  movie: MovieDetails;
  averageRating: number; // averageRating prop 추가
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ movie, averageRating }) => {
  const { memberNo } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikeStatusWrapper = async () => {
      if (memberNo === null) return;

      try {
        const likedStatus = await fetchLikeStatus(memberNo, movie.id);
        setLiked(likedStatus);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatusWrapper();
  }, [memberNo, movie.id]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideosByMovieId(movie.id);
        setVideoKey(videoData);
      } catch (error) {
        console.error("트레일러 요청 실패: ", error);
      }
    };

    fetchVideo();
  }, [movie.id]);

  const handleLikeClick = async () => {
    if (memberNo === null) {
      setError("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateLikeStatus(memberNo, movie.id, !liked);
      setLiked(!liked);
    } catch (err) {
      setError("좋아요 상태 업데이트 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.topSection}>
        <div className={styles.posterWrapper}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`Poster for ${movie.title}`}
            className={styles.poster}
          />
          <div className={styles.likeSection}>
            <span className={styles.averageRating}>
              <FaStar /> {averageRating.toFixed(1)}
            </span>
            <button
              className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
              onClick={handleLikeClick}
              disabled={loading}
            >
              <FaHeart /> {liked ? "좋아요 취소" : "좋아요"}
            </button>
          </div>
        </div>
        {videoKey && (
          <div className={styles.video}>
            {/* <h3>트레일러</h3> */}
            <div className={styles.iframeContainer}>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoKey}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
      <div className={styles.movieInfo}>
        <h1>{movie.title}</h1>
        {/* <h2>
          {movie.release_date} ·{" "}
          {movie.genres?.map((g) => g.name).join(", ") || "장르 정보 없음"}{" "}
          · {movie.runtime ? `${movie.runtime}분` : "상영 시간 정보 없음"}
        </h2> */}
        <p>{movie.overview}</p>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default MovieHeader;
