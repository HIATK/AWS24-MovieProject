package org.movieproject.posts.entity;

import jakarta.persistence.*;
import lombok.Getter;
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
public class Posts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int postId;

    //영화이름
    private String postMovieTitle;

    //글쓴이
    private String writer;

    //포스트 제목
    private String postTitle;

    //포스트 내용
    private String postContent;

    //Post < - > member 글쓴이 다대일 글쓴이 찾기
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_post")
    private Member member;
    //Post < - > member 글쓴이 다대일 End


    // post <-> Comment
    //일 대 다 설정 하나의 게시글에 다수의 댓글이 달릴수 있음
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
    // post <-> Comment END

    //post <-> image ///나중에 포스트가 여러개의 사진을 가질수 있다면
    //List<Image> 로 변경하고 @OneToMany로 바꿔주면 됩니다.
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "imageId")
    private Image image;
    //post <-> image END

    // Rating <-> Posts 평점 연결
    @OneToOne
    @JoinColumn(name = "rating_id", referencedColumnName = "ratingId")
    private Rating rating;
    // Rating <-> Posts 평점 연결 END




}