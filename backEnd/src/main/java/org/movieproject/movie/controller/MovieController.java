package org.movieproject.movie.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.movie.service.MovieService;
import org.springframework.web.bind.annotation.*;

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
        return movieService.getNowPlayingMovies()
                .thenApply(movies -> {
                    movieService.saveMovies(movies); // 검색된 영화를 저장
                    return movies;
                });
    }

    @GetMapping("/{id}")
    public CompletableFuture<Map<String, String>> getMovieById(@PathVariable Integer id) {
        return movieService.getMovieById(id);
    }

    @GetMapping("/search")
    public CompletableFuture<List<Map<String, String>>> searchMovies(@RequestParam String keyword) {
        log.info("키워드: " + keyword);
        return movieService.searchMovieByKeyword(keyword)
                .thenApply(movies -> {
                    movieService.saveMovies(movies); // 검색된 영화를 저장
                    return movies;
                });
    }
}