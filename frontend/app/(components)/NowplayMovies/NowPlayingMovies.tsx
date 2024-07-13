"use client";

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import styles from "./NowPlayingMovies.module.css";
import { getMovies } from "@/_Service/MovieService";

type Movie = {
  id: string;
  title: string;
  poster_path: string;
};

export default function NowPlayingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const MOVIES_PER_PAGE = 10; // 한 번에 보여줄 영화 개수

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const data = await getMovies();
        setMovies(data);
        setVisibleMovies(data.slice(0, MOVIES_PER_PAGE)); // 처음 10개 영화만 보여줌
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
  }, [loading]);

  useEffect(() => {
    if (page > 1) {
      const newVisibleMovies = movies.slice(0, page * MOVIES_PER_PAGE);
      setVisibleMovies(newVisibleMovies);
    }
  }, [page, movies]);

  return (
    <div className={styles.movielist}>
      <ul className={styles["movie-items"]}>
        {visibleMovies.map((movie) => (
          <li key={movie.id} className={styles["movie-item"]}>
            <Link href={`/movies/details/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                alt={`Poster for ${movie.title}`}
                className={styles["movie-img"]}
              />
            </Link>
          </li>
        ))}
      </ul>
      <div ref={loadMoreRef} className={styles.loadMore}>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
