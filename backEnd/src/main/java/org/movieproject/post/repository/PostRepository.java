package org.movieproject.post.repository;

import org.movieproject.post.entity.Post;
import org.movieproject.post.repository.search.PostSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long>, PostSearch {

    @Query("select p from Post p where p.postTitle like concat('%', :keyword, '%')")
    Page<Post> findKeyword(String keyword, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.movie.movieId = :movieId")
    List<Post> findPostsByMovieId(Integer movieId);

}
