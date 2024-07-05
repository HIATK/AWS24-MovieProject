package org.movieproject.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.member.Entity.Member;
import org.movieproject.member.Entity.Role;
import org.movieproject.member.repository.MemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;

    @GetMapping("/api/check_auth")  // Authority 체크(현재 사이드바 용으로 사용중)
    public ResponseEntity<Object> checkAuth(@RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        Map<String, Object> claims = jwtProvider.validateToken(token);
        String username = (String) claims.get("username");

        Optional<Member> role = memberRepository.findByMemberEmailWithRoles(username); // 사용자의 roleset을 가져오는 메서드

        if (role.isPresent()) {
            Member member = role.get();
            Set<Role> roles = member.getRoleSet();

            Set<String> roleNames = roles.stream()
                    .map(Role::name)
                    .collect(Collectors.toSet());
            log.info("롤 네 임 " + roleNames);
            return ResponseEntity.ok(roleNames);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @PostMapping("/api/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {

        return ResponseEntity.ok().build();
    }
}