package org.movieproject.posts.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.movieproject.comment.entity.Comment;
import org.movieproject.rating.entity.Rating;
import org.movieproject.member.Entity.Member;
import org.movieproject.upload.entity.Image;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@ToString
@NoArgsConstructor
public class Posts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int postId;

    private String writer;
    private String postTitle;
    private String postContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_post")
    private Member member;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>(); // @Builder.Default 추가

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "uuid", referencedColumnName = "uuid")
    private Image image;

    @OneToOne
    @JoinColumn(name = "rating_id", referencedColumnName = "ratingId")
    private Rating rating;

    @Builder
    public Posts( String writer, String postTitle, String postContent, Member member, Image image, Rating rating) {
        this.writer = writer;
        this.postTitle = postTitle;
        this.postContent = postContent;
        this.member = member;
        this.image = image;
        this.rating = rating;
    }

    public void updatePost( String writer, String postTitle, String postContent, Image image, Rating rating) {
        this.writer = writer;
        this.postTitle = postTitle;
        this.postContent = postContent;
        this.image = image;
        this.rating = rating;
    }
}