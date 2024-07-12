'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieDetails } from '@/(types)/types';
import styles from './SearchResults.module.css';

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
                <ul className={styles.resultsList}>
                    {results.map((movie) => (
                        <li key={movie.id} className={styles.resultItem}>
                            <h3>{movie.title}</h3>
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                            <p>{movie.overview}</p>
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
