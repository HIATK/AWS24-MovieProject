package org.movieproject.movie.service;

import org.movieproject.movie.entity.Movie;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public interface MovieService {
    CompletableFuture<List<Map<String, String>>> getNowPlayingMovies();

    CompletableFuture<Map<String, String>> getMovieByMovieId(Integer movieId);

    CompletableFuture<List<Map<String, String>>> searchMovieByKeyword(String keyword);

    void saveMovies(List<Map<String, String>> movies);

    CompletableFuture<List<String>> getYoutubeVideoKeys(Integer movieId);

    List<Integer> getLikedMoviesByMemberNo(Integer memberNo);
}
