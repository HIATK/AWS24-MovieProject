package org.movieproject.config.Filter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.security.exception.AccessTokenException;
import org.movieproject.security.JwtProvider;
import org.movieproject.security.MvpUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class TokenCheckFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final MvpUserDetailsService mvpUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

//        // POST 요청만 처리
//        if (!request.getMethod().equalsIgnoreCase("POST")) {
//            filterChain.doFilter(request, response);
//            return;
//        }

        String path = request.getRequestURI();

        // 특정 경로에 대해서만 필터 적용
        //  !path.startsWith("/api/") && <-이거 아래에 들어가 있었음 프록시 떄문에 잠시 빼둠.
        if ( !path.startsWith("/customer/")) {
            filterChain.doFilter(request, response);
            return;
        }

        log.info("토 큰 체 크 필 터");
        log.info("Jwt 프로바이더 : " + jwtProvider);

        try {
            Map<String, Object> payload = validateAccessToken(request);
            // username 값 얻기
            String username = (String) payload.get("username");

            // UserDetail 정보 얻기
            UserDetails userDetails = mvpUserDetailsService.loadUserByUsername(username);

            // 등록 사용자 인증 정보 생성
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            // Spring Security 에 인증 정보 등록
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);

        } catch (AccessTokenException accessTokenException) {
            accessTokenException.sendResponseError(response);
        }
    }

    private Map<String, Object> validateAccessToken(HttpServletRequest request) throws AccessTokenException {

        String headerStr = request.getHeader("Authorization");

        log.info("headerStr : " + headerStr);

        if (headerStr == null || headerStr.length() < 8) {
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.UNACCEPT);
        }

        // Bearer 생략
        String tokenType = headerStr.substring(0, 6);
        String tokenStr = headerStr.substring(7);

        if (!tokenType.equalsIgnoreCase("Bearer")) {
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.BADTYPE);
        }

        try {
            Map<String, Object> values = jwtProvider.validateToken(tokenStr);

            return values;
        } catch (MalformedJwtException malformedJwtException) {
            log.info("말 폼 드 J W T 익 셉 션");
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.MALFORM);
        } catch (SignatureException signatureException) {
            log.info("시 그 니 쳐 익 셉 션");
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.BADSIGN);
        } catch (ExpiredJwtException expiredJwtException) {
            log.info("만 료 된 토 큰 익 셉 션");
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.EXPIRED);
        }
    }
}
