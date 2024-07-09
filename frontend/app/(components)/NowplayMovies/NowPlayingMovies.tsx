// components/NowPlayingMovies.tsx
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import styles from "./NowPlayingMovies.module.css";
import { getMovies } from "@/movieService";

type Movie = {
  id: string;
  title: string;
  poster_path: string;
};

export default function NowPlayingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className={styles.movielist}>
      <ul className={styles["movie-items"]}>
        {movies.map((movie) => (
          <li key={movie.id} className={styles["movie-item"]}>
            <Link href={`/movies/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                alt={`Poster for ${movie.title}`}
                className={styles["movie-img"]}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
