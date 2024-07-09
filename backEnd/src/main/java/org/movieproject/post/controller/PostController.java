package org.movieproject.post.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.post.dto.PageRequestDTO;
import org.movieproject.post.dto.PageResponseDTO;
import org.movieproject.post.dto.PostDTO;
import org.movieproject.post.service.PostService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
@Log4j2
public class PostController {

    private final PostService postsService;


    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Long> register(@RequestBody PostDTO postsDTO) {
        log.info(postsDTO);
        Long postId = postsService.regPost(postsDTO);
        return Map.of("postId", postId);
    }

    //  @PathVariable을 이용해 /api/posts/postId 경로를 처리
    @GetMapping("/{postId}")
    public PostDTO read(@PathVariable("postId") Long postId) {
        log.info("read postId : " + postId);
        return postsService.readPost(postId);
    }

    //  수정
    @PutMapping(value = "/{postId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> modify(@PathVariable("postId") Long postId,
                                      @RequestBody PostDTO postsDTO) {

        //  잘못된 postId가 발생하지 못하도록
        postsDTO.setPostId(postId);

        postsService.modifyPost(postsDTO);

        return Map.of("result", "success");
    }

    //  삭제
    @DeleteMapping(value = "/{postId}")
    public Map<String, String> remove(@PathVariable("postID") Long postId) {
        postsService.removePost(postId);
        return Map.of("result", "success");
    }

    //  검색 조건과 페이징 처리
    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResponseDTO<PostDTO> list(PageRequestDTO pageRequestDTO) {return postsService.list(pageRequestDTO);}

    @GetMapping("/movie/{movieId}")
    public List<PostDTO> getPostByMovieId(@PathVariable("movieId") Integer   movieId) {
        return postsService.getPostByMovieId(movieId);
    }
}
