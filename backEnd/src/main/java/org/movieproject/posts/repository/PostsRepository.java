package org.movieproject.posts.repository;

import org.movieproject.posts.dto.PostsDTO;
import org.movieproject.posts.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostsRepository extends JpaRepository<Posts, Long> {

}
