package org.movieproject.posts.repository.search;

import org.movieproject.posts.entity.Posts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostSearch {

    //  특정 게시물만 검색
    Page<Posts> search1(Pageable pageable);

    //  title, content 내용을 검색
    Page<Posts> searchAll(String[] types, String keyword, Pageable pageable);
}
