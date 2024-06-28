package org.crm.movieproject.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MemberDTO {
    private Integer memberNo;

    private String memberEmail;

    private String memberPw;

    private String memberName;

    private String memberPhone;
}
