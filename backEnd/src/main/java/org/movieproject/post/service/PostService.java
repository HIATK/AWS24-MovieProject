package org.movieproject.post.service;

import org.movieproject.post.dto.PageRequestDTO;
import org.movieproject.post.dto.PageResponseDTO;
import org.movieproject.post.dto.PostDTO;

import java.util.List;

public interface PostService {

    //  등록
    Long regPost(PostDTO postsDTO);

    //  조회와 목록 처리
    PostDTO readPost(Long postId);

    //  수정
    void modifyPost(PostDTO postsDTO);

    //  삭제
    void removePost(Long postId);

    //  Paging
    PageResponseDTO<PostDTO> list (PageRequestDTO pageRequestDTO);

    // 영화 ID로 포스트 찾기
    List<PostDTO> getPostByMovieId(Integer movieId);

}
