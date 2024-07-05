package org.movieproject.config.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.member.dto.MemberSecurityDTO;
import org.movieproject.security.JwtProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class MvpSocialLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("소셜 로그인 석세스 핸들러");
        log.info(authentication.getPrincipal());

        MemberSecurityDTO memberSecurityDTO = (MemberSecurityDTO) authentication.getPrincipal();

        Map<String, Object> claim = Map.of(
                "username", authentication.getName(),
                "authority", authentication.getAuthorities()
        );

        String accessToken = jwtProvider.generateToken(claim, 5);
        String refreshToken = jwtProvider.generateToken(claim, 10);

        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);

        accessTokenCookie.setPath("/");
        refreshTokenCookie.setPath("/");

        accessTokenCookie.setMaxAge(60);
        refreshTokenCookie.setMaxAge(60);

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        // 임시 비밀번호 사용자 여부에 따라 다른 URL로 리디렉트
        if (memberSecurityDTO.isSocial() && memberSecurityDTO.getMemberPw().length() == 8) {
            log.info("임시 비밀번호 사용자");
            response.sendRedirect("http://localhost:3000/member/login");
        } else {
            response.sendRedirect("http://localhost:3000/member/login");
        }
    }
}
