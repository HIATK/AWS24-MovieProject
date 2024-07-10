package org.movieproject.upload.repository;

import org.movieproject.member.Entity.Member;
import org.movieproject.upload.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {

    Image findByMember(Member member);
}
