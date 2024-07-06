package org.movieproject.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {
    private final WebClient webClient;

    @Value("${apiKey}")
    private String apiKey;

    public MovieServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.themoviedb.org/3").build();
    }

    @Override
    public Mono<List<Map<String, String>>> getNowPlayingMovies() {
        return this.webClient.get()
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
                });
    }

    @Override
    public Mono<Map<String, String>> getMovieById(String id) {
        return this.webClient.get()
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
                        "description", String.valueOf(movie.get("overview")),
                        "poster_path", String.valueOf(movie.get("poster_path"))
                ));
    }
}
