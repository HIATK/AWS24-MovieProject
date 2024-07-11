package org.movieproject.upload.service;

import org.movieproject.upload.dto.UploadResultDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {

    //  이미지 등록
    void saveImage(MultipartFile image, Integer memberNo) throws IOException;
    //  이미지 수정

    //  이미지 삭제


}
