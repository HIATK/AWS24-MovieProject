"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/(components)/NowplayingMovies.module.css";
import PostModal from "@/(components)/PostModal/Post.Modal";
import { getMovies } from "@/movieService";

type Movie = {
  id: string;
  title: string;
  poster_path: string;
};

export default function NowPlayingMovies({
  initialMovieId,
}: {
  initialMovieId?: string;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(
    initialMovieId || null
  );
  const params = useParams();
  const router = useRouter();

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

  useEffect(() => {
    if (params.id) {
      setSelectedMovieId(params.id as string);
    }
  }, [params]);

  const openModal = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  const closeModal = () => {
    router.push("/");
    setSelectedMovieId(null);
  };

  return (
    <div className={styles.movielist}>
      <ul className={styles["movie-items"]}>
        {movies.map((movie) => (
          <li
            key={movie.id}
            className={styles["movie-item"]}
            onClick={() => openModal(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
              alt={`Poster for ${movie.title}`}
              className={styles["movie-img"]}
            />
          </li>
        ))}
      </ul>
      {selectedMovieId && (
        <PostModal movieId={selectedMovieId} onClose={closeModal} />
      )}
    </div>
  );
}
