package org.movieproject.posts.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostsDTO {

    private String writer;

    @NotEmpty
    @Size(min = 5, max = 50)
    private String postTitle;

    @NotEmpty
    private String postContent;

    @Min(value = 1)     //  최소값
    @Max(value = 5)     //  최대값
    private int ratingStar;

    //  등록, 수정 날짜 관련
    private LocalDateTime regDate;
    private LocalDateTime modDate;
}
