package org.movieproject.postTests;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.movieproject.posts.entity.Posts;
import org.movieproject.posts.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.stream.IntStream;

@SpringBootTest
@Log4j2
public class PostRepositoryTests {

    @Autowired
    private PostsRepository postsRepository;

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
}
