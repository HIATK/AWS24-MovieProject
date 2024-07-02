package org.movieproject.service;

import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

public interface MovieService {
    Mono<List<Map<String, String>>> getNowPlayingMovies();
}
