package org.movieproject.like.service;

import lombok.NoArgsConstructor;
import org.movieproject.like.dto.LikeDTO;
import org.movieproject.like.entity.Like;
import org.movieproject.like.repository.LikeRepository;
import org.movieproject.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface LikeService {

    Like addLike(LikeDTO likeDTO);

    List<Like> getLikesByMember(int memberNo);

    void removeLike(int likeId);


}
