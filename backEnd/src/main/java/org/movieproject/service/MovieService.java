package org.movieproject.service;

import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

public interface MovieService {
    Mono<List<Map<String, String>>> getNowPlayingMovies();

    Mono<Map<String, String>> getMovieById(String id); // 새로운 메서드 추가
}
