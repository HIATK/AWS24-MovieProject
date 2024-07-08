package org.movieproject.movie.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Movie {

    @Id
    @Column(unique = true, nullable = false)
    private int id;

    @Column(nullable = false)
    private String movieTitle;

}
