package org.movieproject.posts.service;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.movieproject.member.Entity.Member;
import org.movieproject.member.repository.MemberRepository;
import org.movieproject.posts.dto.PostsDTO;
import org.movieproject.posts.entity.Posts;
import org.movieproject.posts.repository.PostsRepository;
import org.movieproject.rating.entity.Rating;
import org.movieproject.rating.repository.RatingRepository;
import org.movieproject.upload.entity.Image;
import org.movieproject.upload.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostsServiceImpl implements PostsService {
    private final PostsRepository postsRepository;
    private final ModelMapper modelMapper;

    @Override
    public PostsDTO createPost(PostsDTO postsDto) {
        Posts post = modelMapper.map(postsDto, Posts.class);
        post = postsRepository.save(post);
        return modelMapper.map(post, PostsDTO.class);
    }

    @Override
    public PostsDTO updatePost(int postId, PostsDTO postsDto) {
        Posts existingPost = postsRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId: " + postId));

        existingPost.updatePost(
                postsDto.getWriter(),
                postsDto.getPostTitle(),
                postsDto.getPostContent(),
                postsDto.getImage(),
                postsDto.getRating()
        );

        existingPost = postsRepository.save(existingPost);
        return modelMapper.map(existingPost, PostsDTO.class);
    }

    @Override
    public void deletePost(int postId) {
        postsRepository.deleteById(postId);

    }

    @Override
    public PostsDTO getPost(int postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId: " + postId));
        return modelMapper.map(post, PostsDTO.class);
    }
}
