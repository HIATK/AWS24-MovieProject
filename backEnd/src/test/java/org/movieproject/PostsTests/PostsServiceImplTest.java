package org.movieproject.PostsTests;

import org.junit.jupiter.api.Test;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.movieproject.posts.entity.Posts;
import org.movieproject.posts.repository.PostsRepository;
import org.movieproject.posts.service.PostsService;
import org.movieproject.posts.service.PostsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.movieproject.posts.dto.PostsDTO;
import org.movieproject.member.Entity.Member;
import org.movieproject.member.repository.MemberRepository;
import org.movieproject.upload.entity.Image;
import org.movieproject.upload.repository.ImageRepository;
import org.movieproject.rating.entity.Rating;
import org.movieproject.rating.repository.RatingRepository;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
public class PostsServiceImplTest {
    @Autowired
    private PostsService postsService;
    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Test
    public void testCreatePost() {
        // Given
        PostsDTO postsDto = new PostsDTO();
        postsDto.setPostId(1);
        postsDto.setWriter("Christopher Nolan");
        postsDto.setPostTitle("A Great Movie");
        postsDto.setPostContent("Inception is a great movie.");

        Posts postEntity = modelMapper.map(postsDto, Posts.class);

        // Mocking repository save method
        when(postsRepository.save(any(Posts.class))).thenReturn(postEntity);

        // When
        PostsDTO createdPost = postsService.createPost(postsDto);

        // Then
        assertNotNull(createdPost);
        verify(postsRepository, times(1)).save(any(Posts.class));
    }







}