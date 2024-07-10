package org.movieproject.postTests;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.movieproject.post.dto.PostDTO;
import org.movieproject.post.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
public class PostServiceTests {

    @Autowired
    private PostService postsService;

    //  게시물 등록
    @Test
    public void testRegister() {
        log.info(postsService.getClass().getName());

        PostDTO postsDTO = PostDTO.builder()
                .postContent("Test PostContent ~")
                .writer("user")
                .build();

        log.info("postId : " + postId);
    }
}
