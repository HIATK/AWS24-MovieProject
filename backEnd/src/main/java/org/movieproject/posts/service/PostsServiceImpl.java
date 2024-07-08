package org.movieproject.posts.service;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.movieproject.posts.repository.PostsRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostsServiceImpl implements PostsService {
    private final PostsRepository postsRepository;
    private final ModelMapper modelMapper;


}
