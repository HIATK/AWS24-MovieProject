package org.movieproject.upload.service;

import lombok.RequiredArgsConstructor;
import org.movieproject.member.entity.Member;
import org.movieproject.member.repository.MemberRepository;
import org.movieproject.upload.entity.Image;
import org.movieproject.upload.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final MemberRepository memberRepository;

    @Override
    public String uploadImage(MultipartFile file, Integer memberId) throws IOException {

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new IllegalArgumentException("Invalid member id: " + memberId));

        // 파일 저장 로직
        String filePath = "/profile"; // 실제 저장 경로 설정

        // Image 엔티티 생성 및 저장
        Image image = Image.builder()
                .uuid(UUID.randomUUID().toString())
                .filePath(filePath)
                .member(member)
                .build();
        imageRepository.save(image);

        return image.getUuid();
    }

    @Override
    public void modifyImage(String uuid, MultipartFile file) throws IOException {

        Image image = imageRepository.findById(uuid).orElseThrow(() -> new IllegalArgumentException("Image not found with uuid: " + uuid));

        // 파일 저장 로직
        String filePath = "/profile"; // 실제 저장 경로 설정

        // 이미지 엔티티 업데이트
        image.changeImage(filePath);
        imageRepository.save(image);
    }

    @Override
    public void removeImage(String uuid) {
        Image image = imageRepository.findById(uuid).orElseThrow(() -> new IllegalArgumentException("Image not found with uuid: " + uuid));
        imageRepository.delete(image);
    }
}
