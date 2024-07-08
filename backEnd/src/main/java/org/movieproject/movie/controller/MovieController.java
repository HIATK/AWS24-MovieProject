package org.movieproject.movie.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.service.MovieService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieService movieService;

    @GetMapping("/now-playing")
    public Mono<List<Map<String, String>>> getNowPlayingMovies() {
        return movieService.getNowPlayingMovies();
    }

    @GetMapping("/{id}")
    public Mono<Map<String, String>> getMovieById(@PathVariable String id) {
        return movieService.getMovieById(id);
    }
}