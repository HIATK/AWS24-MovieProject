package org.movieproject.upload.service;

import org.movieproject.upload.dto.UploadResultDTO;
import org.movieproject.upload.entity.Image;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface ImageService {

    //  이미지 등록
    void saveImage(MultipartFile image, Integer memberNo) throws IOException;

    //  이미지 조회
    Image getProfileImage(Integer memberNo);

}
