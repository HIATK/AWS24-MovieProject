package org.movieproject.movie.repository;

import org.movieproject.likes.entity.Likes;
import org.movieproject.movie.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Integer> {

    @Query("SELECT m FROM Movie m WHERE m.movieId = :movieId")
    Optional<Movie> findMovieByMovieId(Integer movieId);

    @Query("SELECT m FROM Movie m JOIN m.likes l WHERE l.member.memberNo = :memberNo AND l.liked = true")
    List<Movie> findLikedMoviesByMemberNo(@Param("memberNo") Integer memberNo);
}
