package org.movieproject.member.controller;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.like.entity.Like;
import org.movieproject.member.dto.MemberDTO;
import org.movieproject.member.entity.Member;
import org.movieproject.member.repository.MemberRepository;
import org.movieproject.member.service.MemberService;
import org.movieproject.security.JwtProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
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

    // 회원정보 수정 / 비밀번호 검증
    @PostMapping("/verifyPw")
    public ResponseEntity<Map<String, Object>> verifyPassword(@RequestBody Map<String, String> request) {
        log.info("리퀘스트 !!! : " + request);
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            log.info("프린서펄 값 !!!: {}", username);

            Optional<Member> memberOptional = memberRepository.findByMemberEmailWithRoles(username);

            log.info("멤버 옵셔널 !!! : " + memberOptional);
            if (memberOptional.isPresent()) {
                Member member = memberOptional.get();
                log.info("멤버 !!! : "+ member);
                boolean isPasswordValid = passwordEncoder.matches(request.get("password"), member.getMemberPw());
                log.info("isPasswordValid !!! : " + isPasswordValid);
                return ResponseEntity.ok(Map.of("isValid", (Object) isPasswordValid));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "사용자를 찾을 수 없습니다."));
            }
        } catch (JwtException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token"));
        }
    }

//    // 회원정보 수정 / 중복된 닉네임 체크
//    @PostMapping("/verifyNick")
//    public ResponseEntity<Map<String, Object>> verifyNick(@RequestBody Map<String, String> request) {
//        log.info("리퀘스트 !!! : " + request);
//        try {
//
//            if (memberOptional.isPresent()) {
//                Member member = memberOptional.get();
//                log.info("멤버 !!! : "+ member);
//                boolean isPasswordValid = passwordEncoder.matches(request.get("password"), member.getMemberPw());
//                log.info("isPasswordValid !!! : " + isPasswordValid);
//                return ResponseEntity.ok(Map.of("isValid", (Object) isPasswordValid));
//            } else {
//                return ResponseEntity.badRequest().body(Map.of("error", "사용자를 찾을 수 없습니다."));
//            }
//        } catch (JwtException e) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token"));
//        }
//    }


    // 회원정보 수정
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
    public ResponseEntity<Object> checkAuth() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
            }

            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            Set<String> roles = authorities.stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                    .collect(Collectors.toSet());
            return ResponseEntity.ok(roles);

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