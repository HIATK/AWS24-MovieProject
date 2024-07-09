package org.movieproject.member.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.movieproject.like.entity.Like;
import org.movieproject.post.entity.Post;
import org.movieproject.upload.entity.Image;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@ToString(exclude = {"roleSet", "post", "likes", "image"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer memberNo;

    @Column(nullable = false)
    private String memberEmail;

    @Column(nullable = false)
    private String memberPw;

    @Column(nullable = false)
    private String memberName;

    @Column(nullable = false)
    private String memberPhone;

    @Column(nullable = false)
    private String memberNick;

    private boolean social;

    @ElementCollection(targetClass = Role.class, fetch = FetchType.LAZY)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<Role> roleSet = new HashSet<>();

    public void addRole(Role role) {
        this.roleSet.add(role);
    }

    //  회원 당 프로필 이미지는 1개만 적용 가능
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "member")
    private Image image;

    //Member < - > Post One To Many
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private Post post;

    //Member < - > Post One To Many END

    ///좋아요 (like) 참조
    //다대일 정의/매핑, 역방향 관계 / member 엔티티의 변경이 like엔티티에도 전파되도록 설정한것
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL,orphanRemoval = true)
    @Builder.Default
    private List<Like> likes = new ArrayList<>();
    //////좋아요 (like) 참조 END

    public List<Like> getLikeMovies() {
        return likes;
    }


}