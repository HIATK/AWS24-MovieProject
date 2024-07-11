package org.movieproject.like.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.ToString;
import org.movieproject.member.entity.Member;

@Entity
@Getter
@ToString
@Data
//like가 sql 예약어라서 테이블 명을 따로 지정했습니다
@Table(name = "liked_movies")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int likeId;

    private String likeMovie;

    //member 참조 찜목록
    //member엔티티와 다대일 관계를 정의
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_no")
    private Member member;
    //member 참조 찜목록 END

    public void setMember(Member member) {
        this.member = member;
    }

}
