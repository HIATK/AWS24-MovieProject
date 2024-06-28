package org.movieproject.dto;

import lombok.*;
import org.movieproject.domain.Role;

import java.util.Set;

@Data
public class MemberDTO {
    private Integer memberNo;

    private String memberEmail;

    private String memberPw;

    private String memberName;

    private String memberPhone;

    private Set<Role> roleSet;
}
