'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieDetails } from '@/(types)/types';
import styles from './SearchResults.module.css';
import Link from 'next/link';

const SearchResults = () => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('keyword') || '';
    const [results, setResults] = useState<MovieDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm) {
                try {
                    const response = await fetch(`http://localhost:8000/api/movies/search?keyword=${encodeURIComponent(searchTerm)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setResults(data);
                    } else {
                        console.error('Failed to fetch search results');
                    }
                } catch (error) {
                    console.error('Error fetching search results:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchResults();
    }, [searchTerm]);

    return (
        <div className={styles.container}>
            <h1>Search Results for "{searchTerm}"</h1>
            {loading ? (
                <p>Loading...</p>
            ) : results.length > 0 ? (
                <ul className={styles["movie-items"]}>
                    {results.map((movie) => (
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
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default SearchResults;
