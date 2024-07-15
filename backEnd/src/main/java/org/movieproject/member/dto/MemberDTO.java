package org.movieproject.member.dto;

import lombok.*;
import org.movieproject.likes.dto.LikesDTO;
import org.movieproject.likes.entity.Likes;
import org.movieproject.member.entity.Role;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
public class MemberDTO {
    private Integer memberNo;

    private String memberEmail;

    private String memberPw;

    private String memberName;

    private String memberPhone;

    private String memberNick;

    private Set<Role> roleSet;
}
