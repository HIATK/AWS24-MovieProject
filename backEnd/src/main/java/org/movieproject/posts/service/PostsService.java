package org.movieproject.posts.service;

import org.movieproject.posts.dto.PageRequestDTO;
import org.movieproject.posts.dto.PageResponseDTO;
import org.movieproject.posts.dto.PostsDTO;

public interface PostsService {

    //  등록
    Long regPost(PostsDTO postsDTO);

    //  조회와 목록 처리
    PostsDTO readPost(Long postId);

    //  수정
    void modifyPost(PostsDTO postsDTO);

    //  삭제
    void removePost(Long postId);

    //  Paging
    PageResponseDTO<PostsDTO> list (PageRequestDTO pageRequestDTO);

}
