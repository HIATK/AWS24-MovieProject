package org.movieproject.posts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.movieproject.member.Entity.Member;
import org.movieproject.rating.entity.Rating;
import org.movieproject.upload.entity.Image;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostsDTO {

    private int postId;
    private String writer;
    private String postTitle;
    private String postContent;
    private Image image;
    private Rating rating;
}
