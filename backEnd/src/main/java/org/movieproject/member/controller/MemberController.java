package org.movieproject.member.controller;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.like.entity.Like;
import org.movieproject.member.entity.Member;
import org.movieproject.member.dto.MemberDTO;
import org.movieproject.member.repository.MemberRepository;
import org.movieproject.member.service.MemberService;
import org.movieproject.security.JwtProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/member")
@Log4j2
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@Valid @RequestBody MemberDTO memberDTO) {

        log.info("회원가입 진행중 !!!");
        log.info(memberDTO);

        try{
            memberService.memberJoin(memberDTO);
        } catch (MemberService.MidExistException e) {
            return ResponseEntity.badRequest().body("중복된 아이디 입니다 !!!");
            }
        return ResponseEntity.ok("회원가입에 성공하였습니다 !!!");
    }

    // 프로필
    @GetMapping("/profile")
    public ResponseEntity<?> getMemberDetails() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            log.info("프린서펄 값 !!!: {}", username);

            Optional<Member> member = memberRepository.findByMemberEmailWithRoles(username);
            if (member.isPresent()) {
                return ResponseEntity.ok(member.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("멤버를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            log.error("멤버 디테일에 문제가 발생했습니다.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    // 프로필 찜 목록
    @GetMapping("/likes")
    public List<Like> getLikeMovies(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<Member> member = memberRepository.findByMemberEmailWithRoles(userDetails.getUsername());
        return member.orElseThrow().getLikeMovies();
    }

    // 회원 정보 업데이트
    @PutMapping("/update")
    public ResponseEntity<?> update(@Valid @RequestBody MemberDTO memberDTO) {
        log.info("회원 정보 업데이트 시작 !!!"+memberDTO);

        try{
            memberRepository.updateMember(passwordEncoder.encode(memberDTO.getMemberPw()),
                    memberDTO.getMemberName(), memberDTO.getMemberPhone(),
                    memberDTO.getMemberNick(), memberDTO.getMemberEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "회원 정보 업데이트가 성공하였습니다. !!!");
            response.put("member", memberDTO);

            return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.badRequest().body("업데이트 실패하였습니다. !!!");
        }
    }

    @GetMapping("/check_auth")
    public ResponseEntity<?> checkAuth() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
            }

            String username = null;
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                username = userDetails.getUsername(); // 일반적으로 이메일이나 ID를 반환
            }

            Set<String> roles = authentication.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                    .collect(Collectors.toSet());

            String memberNick = null;
            if (username != null) {
                Member member = memberRepository.findByMemberEmail(username)
                        .orElseThrow(() -> new RuntimeException("Member not found"));
                memberNick = member.getMemberNick();
            }

            Map<String, Object> authInfo = new HashMap<>();
            authInfo.put("roles", roles);
            authInfo.put("memberNick", memberNick);
            log.info("멤버닉 서버에서 보낸다: " + memberNick);

            return ResponseEntity.ok(authInfo);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("체크어쓰 실패");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
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