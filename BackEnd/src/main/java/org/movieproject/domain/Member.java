package org.movieproject.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@ToString(exclude = "roleSet")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer memberNo;

    private String memberEmail;

    private String memberPw;

    private String memberName;

    private String memberPhone;

    @ElementCollection(targetClass = Role.class, fetch = FetchType.LAZY)
    @Enumerated(EnumType.STRING)
    private Set<Role> roleSet = new HashSet<>();

    public void addRole(Role role) {
        this.roleSet.add(role);
    }
}
