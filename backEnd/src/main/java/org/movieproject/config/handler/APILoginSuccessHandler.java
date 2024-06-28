package org.movieproject.config.handler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.service.JwtProvider;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Log4j2
@Component
@RequiredArgsConstructor
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        
        log.info("API 로 그 인 석 세 스 핸 들 러");

        log.info("인 증 : " + authentication);
        log.info("겟 네 임 : " + authentication.getName());

        Map<String, Object> claim = Map.of("username", authentication.getName(), "authority", authentication.getAuthorities());
        // 액세스 토큰 5분
        String accessToken = jwtProvider.generateToken(claim, 1);
        // 리프레시 토큰 10분
        String refreshToken = jwtProvider.generateToken(claim, 3);

        response.addHeader("Authorization", "Bearer " + accessToken);

        // 사용자 역할 가져오기
        GrantedAuthority grantedAuthority = authentication.getAuthorities().iterator().next();
        String authority = grantedAuthority.getAuthority();

        Gson gson = new Gson();

        Map<String, Object> keyMap = Map.of("accessToken", accessToken, "refreshToken", refreshToken, "authority", authority);

        log.info("이 내용으로 토큰 생성 : " + keyMap);

        String jsonStr = gson.toJson(keyMap);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        response.setCharacterEncoding("UTF-8");

        response.getWriter().println(jsonStr);

    }
}
