package org.movieproject.movie.repository;

import org.movieproject.movie.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Integer> {

    @Query("SELECT m FROM Movie m WHERE m.movieId = :movieId")
    Optional<Movie> findMovieByMovieId(Integer movieId);
}
