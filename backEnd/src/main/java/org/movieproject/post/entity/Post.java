package org.movieproject.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.movieproject.movie.entity.Movie;
import org.movieproject.member.Entity.Member;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString (exclude = {"movie", "members"})
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    private String postContent;

    //별점
    private int ratingStar;

    //  등록 날짜
    private LocalDate regDate;

    @Setter
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    //  연관관계 구성
    @OneToMany(mappedBy = "post" , cascade = {CascadeType.ALL}, orphanRemoval = true)
    @Builder.Default
    private List<Member> members = new ArrayList<>();

    //  Entity 내에서 변경할 수 있는 내용들을 메소드로 구성
    public void changeContent(String postContent){this.postContent = postContent;}
    public void changeRatingStar(int ratingStar){this.ratingStar = ratingStar;}

    @PrePersist
    public void prePersist() {
        regDate = LocalDate.from(LocalDateTime.now());
    }
}