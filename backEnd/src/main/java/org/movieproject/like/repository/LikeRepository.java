package org.movieproject.like.repository;

import org.movieproject.like.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like,Integer> {
    //
    List<Like> findByMember_MemberNo(int memberNo);
}
