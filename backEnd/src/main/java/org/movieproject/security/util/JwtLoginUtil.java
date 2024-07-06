package org.movieproject.security.util;

import com.google.gson.Gson;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.security.JwtProvider;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Log4j2
@Component
@RequiredArgsConstructor
public class JwtLoginUtil {

    private final JwtProvider jwtProvider;
    private final Gson gson = new Gson();

    public void generateAndSendTokens(HttpServletResponse response, Authentication authentication) throws IOException {
        // JWT 생성
        Map<String, Object> claim = Map.of(
                "username", authentication.getName(),
                "authority", authentication.getAuthorities()
        );
        // 액세스 토큰 5분
        String accessToken = jwtProvider.generateToken(claim, 5);
        // 리프레시 토큰 10분
        String refreshToken = jwtProvider.generateToken(claim, 10);

        // 액세스 토큰 쿠키 생성
        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
//        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(300); // 5분 (300초)

        // 리프레시 토큰 쿠키 생성
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(600); // 10분 (600초)

        // 쿠키를 응답에 추가
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        // 사용자 역할 가져오기
        GrantedAuthority grantedAuthority = authentication.getAuthorities().iterator().next();
        String authority = grantedAuthority.getAuthority();

        Map<String, Object> keyMap = Map.of(
                "authority", authority
        );

        log.info("이 내용으로 토큰 생성 : " + keyMap);

        String jsonStr = gson.toJson(keyMap);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().println(jsonStr);
    }
}
