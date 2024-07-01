import React, { useEffect, useState } from 'react';
import { fetchNowPlayingMovies } from '../api/fetchNowPlayingMovies';


const NowPlayingMoviesComponent = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await fetchNowPlayingMovies();
      setMovies(data);
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <h2>Now Playing Movies</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
            <p>{movie.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NowPlayingMoviesComponent;
