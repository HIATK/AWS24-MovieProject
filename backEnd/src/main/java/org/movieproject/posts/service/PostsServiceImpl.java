package org.movieproject.posts.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.movieproject.posts.dto.PostsDTO;
import org.movieproject.posts.repository.PostsRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class PostsServiceImpl implements PostsService {

    private final PostsRepository postsRepository;
    private final ModelMapper modelMapper;

//    @Override
//    public Long regPost(PostsDTO postsDTO) {
//        return 0;
//    }
//
//    @Override
//    public PostsDTO readPost(Long postId) {
//        return null;
//    }
//
//    @Override
//    public void modifyPost(PostsDTO postsDTO) {
//
//    }
//
//    @Override
//    public void removePost(Long postId) {
//
//    }
}
