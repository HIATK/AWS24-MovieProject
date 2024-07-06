package org.movieproject.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    @GetMapping("/api/check_auth")
    public ResponseEntity<Object> checkAuth(@CookieValue(name = "accessToken", required = false) String accessToken) {


        Map<String, Object> claims = jwtProvider.validateToken(accessToken);
        String username = (String) claims.get("username");

        Optional<Member> role = memberRepository.findByMemberEmailWithRoles(username); // 사용자의 roleset을 가져오는 메서드

        if (role.isPresent()) {
            Member member = role.get();
            Set<Role> roles = member.getRoleSet();

            Set<String> roleNames = roles.stream()
                    .map(Role::name)
                    .collect(Collectors.toSet());
            return ResponseEntity.ok(roleNames);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
    }


    @PostMapping("/api/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // accessToken 쿠키 삭제
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0); // 쿠키 만료
        response.addCookie(accessTokenCookie);

        // refreshToken 쿠키 삭제
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // 쿠키 만료
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok().build();
    }
}