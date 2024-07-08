package org.movieproject.posts.entity;

import jakarta.persistence.*;
import lombok.*;
import org.movieproject.movie.entity.Movie;
import org.movieproject.member.Entity.Member;
import org.movieproject.upload.entity.Image;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString (exclude = {"movie", "members", "images"})
public class Posts extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int postId;

    private String writer;
    private String postTitle;
    private String postContent;

    //별점
    private int ratingStar;

    @Setter
    @ManyToOne
    @JoinColumn(name = "movieId")
    private Movie movie;

    //  연관관계 구성
    @OneToMany(mappedBy = "posts" , cascade = {CascadeType.ALL}, orphanRemoval = true)
    @Builder.Default
    private List<Member> members = new ArrayList<>();

    @OneToMany(mappedBy = "post" , cascade = {CascadeType.ALL}, orphanRemoval = true)
    @Builder.Default
    private List<Image> images = new ArrayList<>();

    //  Entity 내에서 변경할 수 있는 내용들을 메소드로 구성
    public void changePost(String postTitle, String postContent, int ratingStar) {
        this.postTitle = postTitle;
        this.postContent = postContent;
        this.ratingStar = ratingStar;
    }
}