package org.movieproject.movie.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.movie.service.MovieService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    @GetMapping("/now-playing")
    public CompletableFuture<List<Map<String, String>>> getNowPlayingMovies() {
        return movieService.fetchAndSaveNowPlayingMovies();
    }

    @GetMapping("/{id}")
    public CompletableFuture<Map<String, String>> getMovieById(@PathVariable String id) {
        return movieService.getMovieById(id);
    }

//    @GetMapping("{keyword}")
//    public CompletableFuture<List<Map<String, String>>> getMovieByKeyword(@PathVariable String keyword) {
//        return movieService.searchMovieByKeyword(keyword);
//    }
}