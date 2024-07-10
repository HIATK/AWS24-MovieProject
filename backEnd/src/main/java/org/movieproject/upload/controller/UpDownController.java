package org.movieproject.upload.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.movieproject.upload.dto.UploadResultDTO;
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
@RequestMapping("/api/profile/upload")
@RequiredArgsConstructor
public class UpDownController {

    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file, @RequestParam("memberId") Integer memberId) {
        try {
            String uuid = imageService.uploadImage(file, memberId);
            return ResponseEntity.ok(uuid);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{uuid}/update")
    public ResponseEntity<String> updateProfileImage(@PathVariable String uuid, @RequestParam("file") MultipartFile file) {
        try {
            imageService.modifyImage(uuid, file);
            return ResponseEntity.ok("Profile image updated successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{uuid}/delete")
    public ResponseEntity<String> deleteProfileImage(@PathVariable String uuid) {
        imageService.removeImage(uuid);
        return ResponseEntity.ok("Profile image deleted successfully.");
    }


}
