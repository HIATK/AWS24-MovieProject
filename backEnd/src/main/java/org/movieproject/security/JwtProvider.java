package org.movieproject.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Component
@Log4j2
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey secretKey;

    // 객체 초기화, secretKey 를 Base64로 인코딩
    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        secretKey = new SecretKeySpec(keyBytes, "HmacSHA512");
    }

    private SecretKey getSigningKey() {
        return secretKey;
    }

    // 토큰 생성
    public String generateToken(Map<String, Object> valueMap, int minute) {

//        String username = ((UserDetails)authentication.getPrincipal()).getUsername();

        Map<String, Object> payloads = new HashMap<>(valueMap);

        Date now = new Date();
        Date expiration = new Date(now.getTime() + (minute * 60 * 1000L)); // 분 단위로 설정

        return Jwts.builder()
                .header()
                .add("typ", "JWT")
                .and()
//                .subject(username)
                .claims(payloads)
                .signWith(this.getSigningKey())
                .issuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .expiration(expiration)
                .compact();
    }

    public Map<String, Object> extractClaim(String token) throws JwtException {

        Map<String, Object> claim = null;

        claim = Jwts.parser()
                .verifyWith(this.getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claim;
    }

}
