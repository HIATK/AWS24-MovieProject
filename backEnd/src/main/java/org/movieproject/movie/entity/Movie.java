package org.movieproject.movie.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.movieproject.post.entity.Post;

import java.util.List;

@Entity
@Data
@ToString(exclude = "post")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int  movieId;

    @Column(nullable = false)
    private String movieTitle;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> post;
}
