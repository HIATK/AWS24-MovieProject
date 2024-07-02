package org.movieproject.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;

@Getter
@Entity
@ToString
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ratingId;

    //별점
    private int ratingStar;

    // Rating <-> Posts 평점 연결
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "post_id", referencedColumnName = "postId")
    private Posts posts;
    // Rating <-> Posts 평점 연결


}
