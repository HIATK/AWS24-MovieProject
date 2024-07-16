'use client';

import React, { useState, useEffect, useRef, type ElementRef } from "react";
import styles from '@/@modal/(.)movies/details/[movieId]/MovieModal.module.css';
import { motion } from 'framer-motion';
import { getMovieByMovieId } from "@/_Service/MovieService";
import { getPostsByMovieId, getAverageRatingByMovieId } from "@/_Service/PostService";
import MovieHeader from '@/(components)/Modal/MovieHeader/MovieHeader';
import PostList from '@/(components)/Modal/PostList/PostList';
import PostForm from '@/(components)/Modal/PostForm/PostForm';
import { PostDetails, MovieDetails } from "@/(types)/types";
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

const MovieModal: React.FC<{ movieId: string }> = ({ movieId }) => {
  const numericMovieId = parseInt(movieId, 10);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0); // 기본값을 0으로 설정
  const router = useRouter();
  const dialogRef = useRef<ElementRef<'dialog'>>(null);
  const [isClient, setIsClient] = useState(false);
  const scrollPosition = useRef(0); // 현재 스크롤 위치 저장

  // 모달창 내에서 바탕화면 스크롤 막는 코드입니다.
  useEffect(() => {
    if (isClient) {
      scrollPosition.current = window.scrollY; // 현재 스크롤 위치 저장
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition.current); // 이전 스크롤 위치로 복원
      };
    }
  }, [isClient]);

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
        setError(null);
        const details = await getMovieByMovieId(numericMovieId);
        setMovie(details);
        const fetchedPosts = await getPostsByMovieId(numericMovieId);
        setPosts(fetchedPosts);
        const averageRating = await getAverageRatingByMovieId(numericMovieId); // 평균 별점 가져오기
        setAverageRating(averageRating || 0); // 평균 별점이 없을 경우 0으로 설정
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details. Please try again.");
      }
    };

    fetchMovieDetails();
  }, [numericMovieId]);

  if (error) {
    return <div className={styles.modalOverlay}>{error}</div>;
  }

  if (!movie) {
    return <div className={styles.modalOverlay}>Loading movie information...</div>;
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
          <div className={styles.content}>
            <MovieHeader movie={movie} averageRating={averageRating} />
            <PostForm movieId={numericMovieId} setPosts={setPosts} setAverageRating={setAverageRating} />
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
