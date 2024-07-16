"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';
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
  const [page, setPage] = useState(0);

  const MOVIES_PER_PAGE = 5;

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getMovies();
        setMovies(data);
        setVisibleMovies(data.slice(0, MOVIES_PER_PAGE));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  const handlePrevClick = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextClick = () => {
    setPage((prevPage) => {
      const maxPage = Math.ceil(movies.length / MOVIES_PER_PAGE) - 1;
      return Math.min(prevPage + 1, maxPage);
    });
  };

  useEffect(() => {
    const startIndex = page * MOVIES_PER_PAGE;
    const endIndex = startIndex + MOVIES_PER_PAGE;
    setVisibleMovies(movies.slice(startIndex, endIndex));
  }, [page, movies]);

  return (
    <div className={styles.container}>
      <div className={styles.navigationContainer}>
        <button onClick={handlePrevClick} className={styles.navButton}>
          {page > 0 ? <FaChevronCircleLeft /> : <IoIosArrowDropleft />}
        </button>
        <ul className={styles.movieItems}>
          {visibleMovies.map((movie) => (
            <li key={movie.id} className={styles.movieItem}>
              <Link href={`/movies/details/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                  alt={`Poster for ${movie.title}`}
                  className={styles.movieImg}
                />
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={handleNextClick} className={styles.navButton}>
          {(page + 1) * MOVIES_PER_PAGE < movies.length ? <FaChevronCircleRight /> : <IoIosArrowDropright />}
        </button>
      </div>
    </div>
  );
}
