package org.movieproject.postTests;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.movieproject.posts.dto.PostsDTO;
import org.movieproject.posts.service.PostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
public class PostServiceTests {

    @Autowired
    private PostsService postsService;

    //  게시물 등록
    @Test
    public void testRegister() {
        log.info(postsService.getClass().getName());

        PostsDTO postsDTO = PostsDTO.builder()
                .postTitle("Test PostTitle ~")
                .postContent("Test PostContent ~")
                .writer("user")
                .build();

        long postId = postsService.regPost(postsDTO);

        log.info("postId : " + postId);
    }
}
