'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostUp from '@/(components)/PostUp'; // PostUp 컴포넌트 경로를 올바르게 설정하세요
import styles from '@/(components)/PostUp.module.css';

interface Movie {
  id: string;
  title: string;
  description: string;
  poster_path: string;
}

const MoviePage: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // id를 string으로 변환
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
    }
  }, [id]);

  const fetchMovieDetails = async (movieId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${movieId}`);
      if (response.ok) {
        const data = await response.json();
        setMovie(data);
      } else {
        console.error('Failed to fetch movie details');
      }
    } catch (error) {
      console.error('An error occurred while fetching movie details:', error);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.moviePage}>
        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={`Poster for ${movie.title}`}
            style={{ width: "150px" }}
        />
        <h1>{movie.title}</h1>
        <p>{movie.description}</p>
        <PostUp movieTitle={movie.title} /> {/* 영화 제목을 PostUp 컴포넌트로 전달 */}
    </div>
  );
};

export default MoviePage;
