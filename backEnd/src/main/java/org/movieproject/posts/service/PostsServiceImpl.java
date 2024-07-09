package org.movieproject.posts.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.movieproject.posts.dto.PageRequestDTO;
import org.movieproject.posts.dto.PageResponseDTO;
import org.movieproject.posts.dto.PostsDTO;
import org.movieproject.posts.entity.Posts;
import org.movieproject.posts.repository.PostsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class PostsServiceImpl implements PostsService {

    private final PostsRepository postsRepository;
    private final ModelMapper modelMapper;

    //  게시물 등록 기능
    @Override
    public Long regPost(PostsDTO postsDTO) {

        Posts posts = modelMapper.map(postsDTO, Posts.class);
        Long postId = postsRepository.save(posts).getPostId();

        return postId;
    }

    //  게시물 조회 & 목록 기능
    @Override
    public PostsDTO readPost(Long postId) {

        Optional<Posts> result = postsRepository.findById(postId);
        Posts posts = result.orElseThrow();

        return modelMapper.map(posts, PostsDTO.class);
    }

    //  게시물 수정 기능
    @Override
    public void modifyPost(PostsDTO postsDTO) {
        Optional<Posts> result = postsRepository.findById(postsDTO.getPostId());
        Posts posts = result.orElseThrow();

        posts.changeTitle(postsDTO.getPostTitle());
        posts.changeContent(postsDTO.getPostContent());
        posts.changeRatingStar(postsDTO.getRatingStar());

        postsRepository.save(posts);
    }

    //  게시물 삭제 기능
    @Override
    public void removePost(Long postId) {postsRepository.deleteById(postId);}

    //  페이징 처리 기능
    @Override
    public PageResponseDTO<PostsDTO> list(PageRequestDTO pageRequestDTO) {

        String[] types = pageRequestDTO.getTypes();
        String keyword = pageRequestDTO.getKeyword();
        Pageable pageable = pageRequestDTO.getPageable("postId");
        Page<Posts> result = postsRepository.searchAll(types,keyword,pageable);

        //  변환 Posts -> PostsDTO
        List<PostsDTO> dtoList = result.getContent().stream()
                .map(posts -> modelMapper.map(posts, PostsDTO.class))
                .collect(Collectors.toList());

        return PageResponseDTO.<PostsDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(dtoList)
                .total((int) result.getTotalElements())
                .build();
    }
}
