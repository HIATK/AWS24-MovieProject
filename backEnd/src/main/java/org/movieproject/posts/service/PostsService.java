package org.movieproject.posts.service;

import org.movieproject.posts.dto.PostsDTO;

import java.util.List;

public interface PostsService {

    PostsDTO createPost(PostsDTO postsDto);
    PostsDTO updatePost(int postId, PostsDTO postsDto);
    void deletePost(int postId);
    PostsDTO getPost(int postId);
}
