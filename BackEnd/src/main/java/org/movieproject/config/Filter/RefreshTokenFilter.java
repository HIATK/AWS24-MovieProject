package org.movieproject.config.Filter;

import com.google.gson.Gson;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.security.exception.RefreshTokenException;
import org.movieproject.service.JwtProvider;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class RefreshTokenFilter extends OncePerRequestFilter {

    private final String refreshPath;

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        if (!path.equals(refreshPath)) {
            log.info("리 프 레 시 패 스 : " + refreshPath);
            log.info("그 냥 패 스 : " + path);
            log.info("리 프 레 시 토 큰 을 이 미 가 지 고 잇 다");
            filterChain.doFilter(request, response);
            return;
        }
        log.info("리 프 레 시 토 큰 필 터 실 행");

        // 전송된 JSON 에서 accessToken 과 refreshToken 가져오기
        Map<String, String> tokens = parseRequestJSON(request);
        
        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");
        
        log.info("액 세 스 토 큰 : " + accessToken);
        log.info("리 프 레 시 토 큰 : " + refreshToken);

        try {   // 엑 세 스 토 큰 체 크
            checkAccessToken(accessToken);
        } catch (RefreshTokenException refreshTokenException) {
            refreshTokenException.sendResponseError(response);
        }

        Map<String, Object> refreshClaims = null;

        try {
            refreshClaims = checkRefreshToken(refreshToken);
            log.info(refreshClaims);

            // refreshToken 의 유효기간이 얼마 남지 않은 경우
            long exp = (long)refreshClaims.get("exp");

            Date expTime = new Date(Instant.ofEpochMilli(exp).toEpochMilli() * 1000);

            Date current = new Date(System.currentTimeMillis());

            // 만료 시간과 현재 시간의 간격 계산
            // 5분 미만이면 refreshToken 생성
            long gapTime = (expTime.getTime() - current.getTime());

            long seconds = (gapTime / 1000) % 60;
            long minutes = (gapTime / (1000 * 60)) % 60;
            long hours = (gapTime / (1000 * 60 * 60)) % 24;

            log.info("현 재 시 간 : " + current);
            log.info("만 료 시 간 : " + expTime);
            log.info("갭 타 임 : " + hours + "시간 " + minutes + "분 " + seconds + "초");

            String username = (String)refreshClaims.get("username");

            // 여기부터 AccessToken 생성
            String accessTokenValue = jwtProvider.generateToken(Map.of("username", username), 3);

            String refreshTokenValue = tokens.get("refreshToken");

            // refreshToken 만료 시간이 5분 이하일 때
            if (gapTime < (1000 * 60 * 1)) {
                log.info("리프레시 토큰을 새로 만듭시다");
                refreshTokenValue = jwtProvider.generateToken(Map.of("username", username), 3);
            }

            log.info("액 세 스 토 큰 : " + accessTokenValue);
            log.info("리 프 레 시 토 큰 : " + refreshTokenValue);

            sendTokens(accessTokenValue, refreshTokenValue, response);
        } catch (RefreshTokenException refreshTokenException) {
            refreshTokenException.sendResponseError(response);
            return;
        }

    }

    private Map<String, String> parseRequestJSON(HttpServletRequest request) {

        // JSON 데이터를 분석해서 id와 pw 전달 값을 Map 으로 처리
        try(Reader reader = new InputStreamReader(request.getInputStream())) {

            Gson gson = new Gson();

            return gson.fromJson(reader, Map.class);

        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }
    
    private void checkAccessToken(String accessToken) throws RefreshTokenException {
        try {
            jwtProvider.validateToken(accessToken);
        } catch (ExpiredJwtException expiredJwtException) {
            log.info("액 세 스 토 큰 이 만 료 되 었 다");
        } catch (Exception exception) {
            throw new RefreshTokenException(RefreshTokenException.ErrorCase.NO_ACCESS);
        }
    }

    private Map <String, Object> checkRefreshToken(String refreshToken) throws RefreshTokenException {
        try {
            Map<String, Object> values = jwtProvider.validateToken(refreshToken);
            return values;
        } catch (ExpiredJwtException expiredJwtException) {
            throw new RefreshTokenException(RefreshTokenException.ErrorCase.OLD_REFRESH);
        } catch (MalformedJwtException malformedJwtException) {
            log.info("말 폼 드 J W T 익 셉 션");
            throw new RefreshTokenException(RefreshTokenException.ErrorCase.NO_REFRESH);
        }  catch (Exception exception) {
            new RefreshTokenException(RefreshTokenException.ErrorCase.NO_REFRESH);
        }
        return null;
    }

    private void sendTokens(String accessTokenValue, String refreshTokenValue, HttpServletResponse response) {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Gson gson = new Gson();

        String jsonStr = gson.toJson(Map.of("accessToken", accessTokenValue, "refreshToken", refreshTokenValue));

        try {
            response.getWriter().println(jsonStr);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
