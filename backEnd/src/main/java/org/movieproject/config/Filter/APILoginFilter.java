package org.movieproject.config.Filter;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Map;

@Log4j2
public class APILoginFilter extends AbstractAuthenticationProcessingFilter {

    public APILoginFilter(String defaultFilterProcessesUrl) {
        super(defaultFilterProcessesUrl);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        log.info("API 로그인 필터");

        if (request.getMethod().equalsIgnoreCase("GET")) {
            return null;
        }
        log.info("리 퀘 스 트 : " + request.getRequestURI());
        Map<String, String> jsonData = parseRequestJSON(request);
        log.info("제 이 슨 데 이 터 생 성");
        log.info(jsonData);
        log.info("제 이 슨 데 이 터 유 저 네 임 : " + jsonData.get("username"));

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(jsonData.get("username"), jsonData.get("password"));
        log.info("인 증 토 큰 이 름 : " + authenticationToken.getName());
        return getAuthenticationManager().authenticate(authenticationToken);
    }

    private Map<String, String> parseRequestJSON(HttpServletRequest request) {

        // JSON 데이터 분석
        try (Reader reader = new InputStreamReader(request.getInputStream())) {

            Gson gson = new Gson();
            log.info("지 슨 생 성");
            return gson.fromJson(reader, Map.class);

        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }
}
