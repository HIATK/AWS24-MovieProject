package org.movieproject.upload.service;

import lombok.RequiredArgsConstructor;
import org.movieproject.member.entity.Member;
import org.movieproject.member.repository.MemberRepository;
import org.movieproject.upload.entity.Image;
import org.movieproject.upload.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final MemberRepository memberRepository;

    private static final String UPLOAD_DIR = "C:\\Users\\tjoeun\\IdeaProjects\\AWS24-MovieProject\\frontend\\public\\profile";

    @Override
    public void saveImage(MultipartFile file, Integer memberNo) throws IOException {
        //  파일 저장
        UUID uuid = UUID.randomUUID();
        Path path = Paths.get(UPLOAD_DIR, uuid+"_"+file.getOriginalFilename());
        Files.write(path, file.getBytes());

        //  이미지 정보 저장
        Member member = memberRepository.findById(memberNo).orElseThrow(() -> new RuntimeException("Member Not found"));
        Image image = Image.builder()
                .uuid(uuid.toString())
                .filePath(path.toString())
                .member(member)
                .build();

        imageRepository.save(image);
    }
}
