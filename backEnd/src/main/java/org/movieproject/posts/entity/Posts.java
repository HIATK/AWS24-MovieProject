package org.movieproject.posts.entity;

import jakarta.persistence.*;
import lombok.*;
import org.movieproject.movie.entity.Movie;
import org.movieproject.member.Entity.Member;
import org.movieproject.upload.entity.Image;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@ToString
@NoArgsConstructor
@Setter
public class Posts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int postId;

    private String writer;
    private String postTitle;
    private String postContent;

    @Setter
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;


    //별점
    private int ratingStar;




    @OneToMany(mappedBy = "posts", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Member> members = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();
}