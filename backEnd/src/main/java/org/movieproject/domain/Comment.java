package org.movieproject.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int commentId;

    private String commentContent;

    //post와 comment 관계 설정
    //하나의 계정이 많은 댓글을 달수있으므로 다대일 (얘가 다)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Posts post;
    //post와 comment 관계 설정 END

    //어떤 맴버가 작성했는지 Comment와 member의 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
    //어떤 맴버가 작성했는지 Comment와 member의 관계 설정 END
}