package org.movieproject.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class MovieService {

    private final WebClient webClient;

    public MovieService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.themoviedb.org/3").build();
    }

    public Mono<MovieResponse> getMovies() {
        return webClient.get()
                .uri("/discover/movie?include_adult=false&include_video=true&language=ko-KR&page=1&sort_by=popularity.desc&api_key={apiKey}", "YOUR_API_KEY")
                .retrieve()
                .bodyToMono(MovieResponse.class);
    }
}
