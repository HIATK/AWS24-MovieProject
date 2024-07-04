package org.movieproject.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.member.Entity.Member;
import org.movieproject.member.Entity.Role;
import org.movieproject.member.dto.MemberSecurityDTO;
import org.movieproject.member.repository.MemberRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class MvpOauth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RandomPasswordGenerator randomPasswordGenerator;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        log.info("Oauth2 유 저 요 청");
        log.info(userRequest);

        ClientRegistration clientRegistration = userRequest.getClientRegistration();
        String clientName = clientRegistration.getClientName();

        log.info("클라이언트네임 : " + clientName);

        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> paramMap = oAuth2User.getAttributes();

        String memberEmail = null;

        switch (clientName) {
            case "kakao" :
                memberEmail = getKakaoEmail(paramMap);
                break;
        }

        log.info("이 메 일 : " + memberEmail);

        return memberSecurityDTO(memberEmail, paramMap);
    }

    // 소셜 회원 가입
    private MemberSecurityDTO memberSecurityDTO (String memberEmail, Map<String, Object> params) {

        Optional<Member> result = memberRepository.findByMemberEmail(memberEmail);
        log.info("리 절 트" + result);

        if (result.isEmpty()) {
            String randomPassword = passwordEncoder.encode(randomPasswordGenerator.generateRandomPassword(8));
            Member member = Member.builder()
                    .memberNo(null)
                    .memberEmail(memberEmail)
                    .memberPw(randomPassword)
                    .memberPhone("123")
                    .memberName("dd")
                    .memberNick("dd")
                    .social(true)
                    .build();

            member.addRole(Role.GUEST);
            log.info("멤버멤버" + member);
            memberRepository.save(member);

            MemberSecurityDTO memberSecurityDTO = new MemberSecurityDTO(
                    null, memberEmail, "11", "123", "dd",  "dd", true,
                    List.of(new SimpleGrantedAuthority("ROLE_GUEST")));
            log.info("멤버시큐리티디티오" + memberSecurityDTO);
            return memberSecurityDTO;
        } else {
            Member member = result.get();

            MemberSecurityDTO memberSecurityDTO = new MemberSecurityDTO(
                   member.getMemberNo(), member.getMemberEmail(), member.getMemberPw(),
                    member.getMemberPhone(), member.getMemberName(), member.getMemberNick(), member.isSocial(),
                    member.getRoleSet().stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                            .collect(Collectors.toList()));

            memberSecurityDTO.setProps(params);
            log.info("멤버시큐리티디티오222" + memberSecurityDTO);
            return memberSecurityDTO;
        }
    }

    private String getKakaoEmail(Map<String, Object> paramMap) {

        log.info("카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 ");

        Object value = paramMap.get("kakao_account");

        log.info("겟 카 카 오 어 카 운 트 : " + value);

        LinkedHashMap accountMap = (LinkedHashMap)value;

        String email = (String)accountMap.get("email");

        log.info("이 메 일 이 메 일 이 메 일 이 메 일 이 메 일 이 메 일 이 메 일 이 메 일  : " + email);

        return email;
    }
}
