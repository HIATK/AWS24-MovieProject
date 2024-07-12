package org.movieproject.upload.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.movieproject.upload.dto.UploadResultDTO;
import org.movieproject.upload.entity.Image;
import org.movieproject.upload.repository.ImageRepository;
import org.movieproject.upload.service.ImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
@Log4j2
public class UpDownController {

    private final ImageService imageService;
    private static final String UPLOAD_DIR = "C:\\upload";
    private final ImageRepository imageRepository;

    @PostMapping("/upload")
    @Operation(summary = "이미지 업로드", description = "이미지를 업로드하고 저장합니다.")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file,
                                                       @RequestParam("memberNo") Integer memberNo) {
        try {
            imageService.saveImage(file, memberNo);
            String fullPath = imageRepository.findByMemberMemberNo(memberNo).orElseThrow().getFilePath();
            String result = extractPublicPath(fullPath);
            log.info("파일 패쓰다" +result);

            return ResponseEntity.status(HttpStatus.OK).body(result);

        } catch (IOException e) {
            log.error("이미지 업로드 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/download/{fileName}")
    @Operation(summary = "이미지 다운로드", description = "이미지를 다운로드합니다.")
    public ResponseEntity<Resource> downloadImage(@PathVariable String fileName) {
        try {
            Path path = Paths.get(UPLOAD_DIR, fileName);
            Resource resource = new FileSystemResource(path.toFile());
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(path));
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");
            return new ResponseEntity<>(resource, headers, HttpStatus.OK);
        } catch (IOException e) {
            log.error("이미지 다운로드 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/read/{memberNo}")
    @Operation(summary = "프로필 이미지 조회", description = "회원 번호를 기준으로 프로필 이미지를 조회합니다.")
    public ResponseEntity<UploadResultDTO> getProfileImageByMemberNo(@PathVariable Integer memberNo) {

        try {
            Image image = imageService.getProfileImage(memberNo);
            UploadResultDTO uploadResultDTO = UploadResultDTO.builder()
                    .uuid(image.getUuid())
                    .filePath(image.getFilePath())
                    .memberId(image.getMember().getMemberNo())
                    .build();
            return ResponseEntity.ok(uploadResultDTO);
        } catch (Exception e) {
            log.error("프로필 이미지 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    public static String extractPublicPath(String fullPath) {
        String publicDir = "\\profile";
        int index = fullPath.indexOf(publicDir);
        return fullPath.substring(index + publicDir.length());
    }


}
