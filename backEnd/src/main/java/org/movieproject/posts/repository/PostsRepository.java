package org.movieproject.posts.repository;

import org.movieproject.posts.dto.PostsDTO;
import org.movieproject.posts.entity.Posts;
import org.movieproject.posts.repository.search.PostSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostsRepository extends JpaRepository<Posts, Long>, PostSearch {

    @Query("select p from Posts p where p.postTitle like concat('%', :keyword, '%')")
    Page<Posts> findKeyword(String keyword, Pageable pageable);

}
