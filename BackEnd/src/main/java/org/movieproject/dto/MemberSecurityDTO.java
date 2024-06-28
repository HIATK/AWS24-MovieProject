package org.movieproject.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
@Setter
@ToString
public class MemberSecurityDTO extends User { // Security 용도로만 사용되는 DTO
    private Integer memberNo;

    private String memberEmail;

    private String memberPw;

    private String memberPhone;

    private String memberName;

    public MemberSecurityDTO(Integer memberNo, String username, String password,
                          String memberName, String memberPhone
                          Collection<? extends GrantedAuthority> authorities) {

        super(username, password, authorities);

        this.memberNo = memberNo;
        this.memberEmail = username;
        this.memberPw = password;
        this.memberName = memberName;
        this.memberPhone = memberPhone;
    }
}
