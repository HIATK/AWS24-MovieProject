package org.movieproject.movie.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.movieproject.posts.entity.Posts;

import java.util.List;

@Entity
@Data
public class Movie {

    @Id
    @Column(unique = true, nullable = false)
    private int id;

    @Column(nullable = false)
    private String movieTitle;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Posts> posts;
}
