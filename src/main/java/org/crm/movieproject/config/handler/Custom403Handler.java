package org.crm.movieproject.config.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;

@Log4j2
public class Custom403Handler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        log.info("--------------------접근이 거부됐는데요--------------------");

        // 응답 상태 코드 403 (Forbidden)으로 설정.
        response.setStatus(HttpStatus.FORBIDDEN.value());

        // 요청 헤더에서 Content-Type 값 추출
        String contentType = request.getHeader("Content-Type");

        // Content-Type 이 null 이 아니라면 application/json 으로 시작하는지 확인
        boolean jsonRequest = contentType != null && contentType.startsWith("application/json");

        // JSON 요청인지 로그남김
        log.info("제이슨제이슨제이슨제이슨제이슨 isJSON : " + jsonRequest);

        // JSON 요청이 아닌경우
        if (!jsonRequest) {
            // 로그인 페이지로 리다이렉트 하면서 오류 전달
            response.sendRedirect("/accessDenied");
        }
    }
}