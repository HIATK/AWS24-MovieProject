package org.movieproject.upload.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;
import org.movieproject.posts.entity.Posts;

@Entity
@Getter
@ToString
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String uuid;

    private String fileName;

    //일 대 일 관계 설정 Posts랑
    @OneToOne(mappedBy = "image")
    private Posts post;
    //일 대 일 관계 설정 Posts랑 END





}
