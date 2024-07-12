package org.movieproject.movie.service;

import lombok.RequiredArgsConstructor;
import org.movieproject.movie.entity.Movie;
import org.movieproject.movie.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    private final WebClient.Builder webClientBuilder;
    private final MovieRepository movieRepository;

    @Value("${apiKey}")
    private String apiKey;

    private WebClient webClient;

    private WebClient getWebClient() {
        if (this.webClient == null) {
            this.webClient = webClientBuilder.baseUrl("https://api.themoviedb.org/3").build();
        }
        return this.webClient;
    }

    @Async
    @Override
    public CompletableFuture<List<Map<String, String>>> getNowPlayingMovies() {
        return this.getWebClient().get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/now_playing")
                        .queryParam("language", "ko-KR")
                        .queryParam("page", 1)
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(response -> {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                    return results.stream()
                            .map(movie -> Map.of(
                                    "id", String.valueOf(movie.get("id")),
                                    "title", String.valueOf(movie.get("title")),
                                    "poster_path", String.valueOf(movie.get("poster_path"))
                            ))
                            .collect(Collectors.toList());
                })
                .toFuture();
    }

    public void saveMovies(List<Map<String, String>> movies) {
        List<Movie> movieEntities = movies.stream()
                .map(movie -> {
                    Integer movieId = Integer.parseInt(movie.get("id"));
                    // 중복 체크: DB에 해당 movieId가 있는지 확인
                    if (movieRepository.existsById(movieId)) {
                        return null; // 이미 존재하면 null 반환
                    }
                    Movie movieEntity = new Movie();
                    movieEntity.setMovieId(movieId);
                    movieEntity.setMovieTitle(movie.get("title"));
                    return movieEntity;
                })
                .filter(Objects::nonNull) // null이 아닌 영화만 필터링
                .collect(Collectors.toList());

        if (!movieEntities.isEmpty()) {
            movieRepository.saveAll(movieEntities);
        }
    }

    @Async
    @Override
    public CompletableFuture<List<Map<String, String>>> fetchAndSaveNowPlayingMovies() {
        return getNowPlayingMovies()
                .thenApply(movies -> {
                    saveMovies(movies);
                    return movies;
                });
    }

    @Async
    @Override
    public CompletableFuture<Map<String, String>> getMovieById(String id) {
        return this.getWebClient().get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{id}")
                        .queryParam("language", "ko-KR")
                        .queryParam("api_key", apiKey)
                        .build(id))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(movie -> Map.of(
                        "id", String.valueOf(movie.get("id")),
                        "title", String.valueOf(movie.get("title")),
                        "overview", String.valueOf(movie.get("overview")),
                        "poster_path", String.valueOf(movie.get("poster_path"))
                ))
                .toFuture();
    }

//    @Async
//    @Override
//    public CompletableFuture<List<Map<String, String>>> searchMovieByKeyword(String keyword) {
//        return this.webClient.get()
//                .uri(uriBuilder -> uriBuilder
//                        .path("/search/movie")
//                        .queryParam("query", keyword)
//                        .queryParam("language", "ko-KR")
//                        .queryParam("page", 1)
//                        .queryParam("api_key", apiKey)
//                        .build())
//                .retrieve()
//                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
//                .map(response -> {
//                    @SuppressWarnings("unchecked")
//                    List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
//                    return results.stream()
//                            .map(movie -> {
//                                Map<String, String> movieInfo = new HashMap<>();
//                                movieInfo.put("id", String.valueOf(movie.get("id")));
//                                movieInfo.put("title", String.valueOf(movie.get("title")));
//                                movieInfo.put("poster_path", String.valueOf(movie.get("poster_path")));
//                                movieInfo.put("overview", String.valueOf(movie.get("overview")));
//                                return movieInfo;
//                            })
//                            .collect(Collectors.toList());
//                })
//                .toFuture();
//    }
}
