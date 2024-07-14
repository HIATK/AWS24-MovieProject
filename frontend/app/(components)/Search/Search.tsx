'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieDetails } from '@/(types)/types';
import styles from './Search.module.css';
import Link from 'next/link';

const Search = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('keyword') || '';
  const [results, setResults] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm) {
        try {
          const response = await fetch(`http://localhost:8000/api/movies/search?keyword=${encodeURIComponent(searchTerm)}&page=${page}`);
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
              setResults(prevResults => [...prevResults, ...data]);
              if (data.length < 5) {
                setHasMore(false);
              }
            } else {
              setHasMore(false);
            }
          } else {
            console.error('Failed to fetch search results');
            setHasMore(false);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [searchTerm, page]); // searchTerm 또는 page가 변경될 때만 실행

  const lastPosterElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (lastPosterElementRef.current) {
      observer.current.observe(lastPosterElementRef.current);
    }
  }, [loading, hasMore]);

  return (
    <div className={styles.main}>
      <div className={styles.description}>
        <h1>Search Results for "{searchTerm}"</h1>
      </div>
      <div className={styles.posterSection}>
        <ul className={styles["movie-items"]}>
          {results.map((movie, index) => {
            if (results.length === index + 1) {
              return (
                <li key={movie.id} className={styles["movie-item"]} ref={lastPosterElementRef}>
                  <Link href={`/movies/details/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                      alt={`Poster for ${movie.title}`}
                      className={styles["movie-img"]}
                    />
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={movie.id} className={styles["movie-item"]}>
                  <Link href={`/movies/details/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                      alt={`Poster for ${movie.title}`}
                      className={styles["movie-img"]}
                    />
                  </Link>
                </li>
              );
            }
          })}
        </ul>
        {loading && <p>Loading...</p>}
        {!hasMore && <p>No more results</p>}
      </div>
    </div>
  );
};

export default Search;
