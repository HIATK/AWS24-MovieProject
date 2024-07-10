package org.movieproject.post.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.movieproject.post.dto.PageRequestDTO;
import org.movieproject.post.dto.PageResponseDTO;
import org.movieproject.post.dto.PostDTO;
import org.movieproject.post.entity.Post;
import org.movieproject.post.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final ModelMapper modelMapper;

    //  게시물 등록 기능
    @Override
    public Integer regPost(PostDTO postsDTO) {

        Post post = modelMapper.map(postsDTO, Post.class);
        Integer postId = postRepository.save(post).getPostId();

        return postId;
    }

    //  게시물 삭제 기능
    @Override
    public void removePost(Integer postId) {postRepository.deleteById(postId);}

    //  페이징 처리 기능
    @Override
    public PageResponseDTO<PostDTO> list(PageRequestDTO pageRequestDTO) {

        String[] types = pageRequestDTO.getTypes();
        String keyword = pageRequestDTO.getKeyword();
        Pageable pageable = pageRequestDTO.getPageable("postId");
        Page<Post> result = postRepository.searchAll(types,keyword,pageable);

        //  변환 Posts -> PostsDTO
        List<PostDTO> dtoList = result.getContent().stream()
                .map(post -> modelMapper.map(post, PostDTO.class))
                .collect(Collectors.toList());

        return PageResponseDTO.<PostDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(dtoList)
                .total((int) result.getTotalElements())
                .build();
    }

    @Override
    public List<PostDTO> getPostByMovieId(Integer movieId) {
        List<Post> posts = postRepository.findPostsByMovieId(movieId);
        log.info("포스트 확인 " + posts);
        return posts.stream()
                .map(post -> modelMapper.map(post, PostDTO.class))
                .collect(Collectors.toList());
    }
}
