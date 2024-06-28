package org.crm.movieproject.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.crm.movieproject.domain.user;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
@Setter
@ToString
public class userSecurityDTO extends User { // Security 용도로만 사용되는 DTO

    private int id;
    private String userId;
    private String pw;
    private String email;
    private String userName;
    public userSecurityDTO(int id, String userId, String pw, String email, String userName,
                               Collection<? extends GrantedAuthority> authorities) {

        super(userId, pw, authorities);

        this.id = id;
        this.userId = userId;
        this.pw = pw;
        this.email = email;
        this.userName = userName;
    }
}

