package org.movieproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.movieproject.domain.Member;
import org.movieproject.dto.MemberDTO;
import org.movieproject.repository.MemberRepository;
import org.movieproject.security.JwtProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    // 회원가입
    @Override
    public void memberJoin(MemberDTO memberDTO) throws MidExistException{
        String email = memberDTO.getMemberEmail();

        // 아이디 중복확인
        boolean exist = memberRepository.existsByMemberEmail(email);

        if (exist) {
            throw new MemberService.MidExistException("아이디가 중복되었습니다 !!! ");
        }
        // 비밀번호 암호화
        String encodePassword = passwordEncoder.encode(memberDTO.getMemberPw());
        memberDTO.setMemberPw(encodePassword);
        log.info("매핑 전 !!!: {}", memberDTO);

        // 명시적 매핑
        Member member = modelMapper.map(memberDTO, Member.class);
        log.info("매핑 후 !!!: {}", member);

        memberRepository.save(member);

        // JWT 토큰 생성
        Map<String, Object> tokenData = new HashMap<>();
        tokenData.put("email", member.getMemberEmail());

        // 만료시간 60분
        String token = jwtProvider.generateToken(tokenData, 60);

        log.info("JWT 토큰 생성 !!! {}", token);
    }

    // 회원 이메일 참조하여 DTO 반환하는 서비스
    @Override
    @Transactional(readOnly = true)
    public MemberDTO findMemberByEmail(String memberEmail){
        Member member = memberRepository.FindByMemberEmailWithRoles(memberEmail)
                .orElseThrow(() -> new RuntimeException("해당 이메일의 멤버를 찾을 수 없어요 !!!"));
        return convertToDTO(member);
    }
    private MemberDTO convertToDTO(Member member){
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setMemberEmail(member.getMemberEmail());
        memberDTO.setMemberPw(member.getMemberPw());
        memberDTO.setMemberName(member.getMemberName());
        memberDTO.setMemberPhone(member.getMemberPhone());
        memberDTO.setMemberNick(member.getMemberNick());
        return memberDTO;
    }
}