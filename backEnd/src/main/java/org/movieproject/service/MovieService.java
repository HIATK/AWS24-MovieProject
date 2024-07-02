package org.movieproject.service;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MovieService {
    private final WebClient webClient;

    public MovieService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.themoviedb.org/3").build();
    }

    public Mono<List<Map<String, String>>> getNowPlayingMovies() {
        String apiKey = "427ac6c64a0876b843710cc982c41861";
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
                    // 명시적으로 타입 캐스팅
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
}
