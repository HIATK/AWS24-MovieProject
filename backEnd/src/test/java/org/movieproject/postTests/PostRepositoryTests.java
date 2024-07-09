package org.movieproject.postTests;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.movieproject.posts.entity.Posts;
import org.movieproject.posts.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
@Log4j2
public class PostRepositoryTests {

    @Autowired
    private PostsRepository postsRepository;

    //  게시물 등록 테스트
    @Test
    public void testInsertPost() {
        IntStream.rangeClosed(1, 50).forEach(i -> {
            Posts posts = Posts.builder()
                    .postTitle("Test Posts ..." + i)
                    .postContent("Test Posts ..." + i)
                    .writer("writer"+(i%10))
                    .ratingStar((int)(Math.random()*5)+1)
                    .build();

            Posts result = postsRepository.save(posts);
            log.info("postId" + result.getPostId());
        });
    }

    //  게시물 조회 테스트
    @Test
    public void testSelectPost() {
        Long postId = 50L;

        Optional<Posts> result = postsRepository.findById(postId);
        Posts posts = result.orElseThrow();

        log.info(posts);
    }

    //  게시물 수정 테스트
    @Test
    public void testUpdatePost() {
        Long postId = 50L;

        Optional<Posts> result = postsRepository.findById(postId);
        Posts posts = result.orElseThrow();

        posts.changePost("Update Post Title", " Update Content",  2);
        postsRepository.save(posts);
    }

    //  게시물 삭제 테스트
    @Test
    public void testDeletePost() {postsRepository.deleteById(50L);}
}
