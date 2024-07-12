package org.movieproject.upload.repository;

import org.movieproject.member.entity.Member;
import org.movieproject.upload.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, String> {

    Optional<Image> findByMemberMemberNo(Integer memberNo);

}
