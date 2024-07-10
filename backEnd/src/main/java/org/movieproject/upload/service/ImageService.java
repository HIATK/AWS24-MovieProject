package org.movieproject.upload.service;

import org.movieproject.upload.dto.UploadResultDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {

    //  이미지 등록
    String uploadImage(MultipartFile file, Integer memberId) throws IOException;

    //  이미지 수정
    void modifyImage(String uuid, MultipartFile file) throws IOException;

    //  이미지 삭제
    void removeImage(String uuid);

}
