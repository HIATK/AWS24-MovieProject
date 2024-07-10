package org.movieproject.movie.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public interface MovieService {
    CompletableFuture<List<Map<String, String>>> getNowPlayingMovies();

    CompletableFuture<Map<String, String>> getMovieById(String id);

    CompletableFuture<List<Map<String, String>>> fetchAndSaveNowPlayingMovies();
}
