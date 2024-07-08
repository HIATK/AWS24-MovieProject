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

    // Many-to-one relationship with Posts
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private Posts post;

    // Constructors, getters, setters, toString() methods omitted for brevity




}
