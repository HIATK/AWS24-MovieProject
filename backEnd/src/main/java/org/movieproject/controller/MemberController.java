package org.movieproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.dto.MemberDTO;
import org.movieproject.repository.MemberRepository;
import org.movieproject.security.JwtProvider;
import org.movieproject.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@Log4j2
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@Valid @RequestBody MemberDTO memberDTO) {

        log.info("회원가입 진행중 !!!");
        log.info(memberDTO);

        try{
            memberService.memberJoin(memberDTO);
        }catch (MemberService.MidExistException e) {
            return ResponseEntity.badRequest().body("중복된 아이디 입니다 !!!");
        }
        return ResponseEntity.ok("회원가입에 성공하였습니다 !!!");
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody MemberDTO memberDTO) {
        log.info("로그인 진행중 !!!");

        try{
            MemberDTO member = memberService.findMemberByEmail(memberDTO.getMemberEmail());
            if(passwordEncoder.matches(memberDTO.getMemberPw(), member.getMemberPw())){

                Map<String, Object> tokenData = new HashMap<>();
                tokenData.put("email", memberDTO.getMemberEmail());

                String token = jwtProvider.generateToken(tokenData,60);

                return ResponseEntity.ok(token);
            }else{
                return ResponseEntity.status(401).body("자격 증명이 유효 하지 않습니다. !!!");
            }
        }catch(Exception e){
            return ResponseEntity.status(401).body("자격 증명이 유효하지 않습니다. !!!");
        }
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