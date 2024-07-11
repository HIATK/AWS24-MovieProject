package org.movieproject.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.movieproject.movie.entity.Movie;
import org.movieproject.member.entity.Member;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"movie", "member"})
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    private String postContent;

    // 별점
    private int ratingStar;

    // 등록 날짜
    private LocalDate regDate;

    @Setter
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    // Member < - > Post Many To One
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // Entity 내에서 변경할 수 있는 내용들을 메소드로 구성
    public void changeContent(String postContent) {
        this.postContent = postContent;
    }

    public void changeRatingStar(int ratingStar) {
        this.ratingStar = ratingStar;
    }

    @PrePersist
    public void prePersist() {
        regDate = LocalDate.from(LocalDateTime.now());
    }
}
