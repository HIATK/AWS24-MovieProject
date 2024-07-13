package org.movieproject.post.repository;

import org.movieproject.post.entity.Post;
import org.movieproject.post.repository.search.PostSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer>, PostSearch {

    @Query("SELECT p FROM Post p WHERE p.movie.movieId = :movieId order by p.postId desc")
    List<Post> findPostsByMovieId(Integer movieId);

    @Query("SELECT AVG(p.ratingStar) FROM Post p WHERE p.movie.movieId = :movieId")
    Double findAverageRatingByMovieId(Integer movieId);

    //    @Query("select p from Post p where p.postTitle like concat('%', :keyword, '%')")
    //    Page<Post> findKeyword(String keyword, Pageable pageable);
}
