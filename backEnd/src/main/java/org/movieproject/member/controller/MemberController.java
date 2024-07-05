package org.movieproject.member.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.like.entity.Like;
import org.movieproject.member.Entity.Member;
import org.movieproject.member.dto.MemberDTO;
import org.movieproject.member.repository.MemberRepository;
import org.movieproject.member.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/member")
@Log4j2
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
//    private final JwtProvider jwtProvider;

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

    // 마이페이지
    @GetMapping("/mypage")
    public Optional<Member> getMemberDetails(@AuthenticationPrincipal UserDetails userDetails) {
        return memberRepository.findByMemberEmailWithRoles(userDetails.getUsername());
    }

    @GetMapping("/likes")
    public List<Like> getLikeMovies(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<Member> member = memberRepository.findByMemberEmailWithRoles(userDetails.getUsername());
        return member.orElseThrow().getLikeMovies();
    }

    // 회원 정보 업데이트
    @PostMapping("/update")
    public ResponseEntity<?> update(@Valid @RequestBody MemberDTO memberDTO) {
        log.info("회원 정보 업데이트 시작 !!!"+memberDTO);

        try{
            memberRepository.updateMember(passwordEncoder.encode(memberDTO.getMemberPw()),
                    memberDTO.getMemberName(), memberDTO.getMemberPhone(),
                    memberDTO.getMemberNick(), memberDTO.getMemberEmail());
        }catch(Exception e){
            return ResponseEntity.badRequest().body("업데이트 실패하였습니다. !!!");
        }
        return ResponseEntity.ok("회원 정보 업데이트가 성공하였습니다. !!!");
    }
}