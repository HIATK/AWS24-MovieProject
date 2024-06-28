package org.crm.movieproject.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.crm.movieproject.domain.Member;
import org.crm.movieproject.dto.MemberSecurityDTO;
import org.crm.movieproject.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class MvpUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("loadUserByUsername : " + username);

        Optional<Member> memberResult = memberRepository.FindByMemberEmail(username);
        if (memberResult.isPresent()) {
            Member member = memberResult.get();
//            MemberSecurityDTO memberSecurityDTO = new MemberSecurityDTO(
//                    member.getMemberNo(),
//                    member.getMemberEmail(),
//                    member.getMemberPw(),
//                    member.getMemberName(),
//                    member.getMemberPhone()
//            );

//            log.info("멤버 시큐리티 DTO: " + memberSecurityDTO);
            return null;
        }

        throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
    }

}