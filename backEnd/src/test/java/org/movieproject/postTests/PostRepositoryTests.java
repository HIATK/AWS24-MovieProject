package org.movieproject.postTests;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.movieproject.posts.entity.Posts;
import org.movieproject.posts.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
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
        IntStream.rangeClosed(52, 150).forEach(i -> {
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

        posts.changeTitle("Update title !!");
        posts.changeContent("Update content ~~");
        posts.changeRatingStar(3);
        postsRepository.save(posts);
    }

    //  게시물 삭제 테스트
    @Test
    public void testDeletePost() {postsRepository.deleteById(50L);}

    //  페이징 처리 테스트
    //  Pageable 이용하여 값을 넘기고 반환 타입은 Page<T>를 이용
    @Test
    public void testPaging() {
        //  Page order by postId desc (역정렬)
        Pageable pageable =
                PageRequest.of(0, 5, Sort.by("postId").descending());

        Page<Posts> result  = postsRepository.findAll(pageable);

        log.info("total count : " + result.getTotalElements());
        log.info("total pages : " + result.getTotalPages());
        log.info("page number : " + result.getNumber());
        log.info("page size : " + result.getSize());

        log.info("이전 페이지 여부 : " + result.hasPrevious());
        log.info("다음 페이지 여부 : " + result.hasNext());

        List<Posts> postsList = result.getContent();
        postsList.forEach(posts -> log.info(posts));
    }

    @Test
    public void testSearch1() {
        //  Page order by postId desc
        Pageable pageable = PageRequest.of(1, 5, Sort.by("postId").descending());

        postsRepository.search1(pageable);
    }

    @Test
    public void testSearchAll() {

        String[] types = {"title", "content", "writer"};

        String keyword = "test";

        Pageable pageable = PageRequest.of(1, 5, Sort.by("postId").descending());

        Page<Posts> result = postsRepository.searchAll(types, keyword, pageable);

        result.getContent().forEach(posts -> log.info(posts));

        log.info(" 사이즈 : " + result.getSize());
        log.info(" 페이지 번호 : " + result.getNumber());
        log.info(" 이전 페이지 : " + result.hasPrevious());
        log.info(" 다음 페이지 : " + result.hasNext());
    }

}
