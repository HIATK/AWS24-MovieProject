package org.movieproject.upload.entity;

import jakarta.persistence.*;
import lombok.*;
import org.movieproject.posts.entity.Posts;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "post")
public class Image{

    @Id
    private String uuid;

    private String fileName;

    private boolean img;

    //일 대 일 관계 설정 Posts랑
    @OneToOne(fetch = FetchType.LAZY)
    private Posts post;
    //일 대 일 관계 설정 Posts랑 END





}
