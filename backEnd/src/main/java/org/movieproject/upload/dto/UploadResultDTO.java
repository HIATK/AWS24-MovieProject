package org.movieproject.upload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UploadResultDTO {

    private String uuid;

    private String fileName;

    private boolean img;

    //  JSON으로 처리될 때는 link 라는 속성으로 자동 처리됨
    private String getLink() {
        if(img) {
            return "s_" + uuid + "_" + fileName;    //  이미지인 경우 썸네일(s_)
        }else {
            return uuid + "_" + fileName;
        }
    }
}
