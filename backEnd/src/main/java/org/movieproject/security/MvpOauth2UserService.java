//package org.movieproject.security;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.crm.crmproject.domain.Ceo;
//import org.crm.crmproject.dto.CeoSecurityDTO;
//import org.crm.crmproject.repository.CeoRepository;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.oauth2.client.registration.ClientRegistration;
//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
//import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.stereotype.Service;
//
//import java.util.LinkedHashMap;
//import java.util.Map;
//import java.util.Optional;
//import java.util.Set;
//
//import static org.crm.crmproject.domain.Role.CEO;
//
//@Log4j2
//@Service
//@RequiredArgsConstructor
//public class MvpOauth2UserService extends DefaultOAuth2UserService {
//
//    private final CeoRepository ceoRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final RandomPasswordGenerator randomPasswordGenerator;
//
//    @Override
//    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//
//        log.info("Oauth2 유 저 요 청");
//        log.info(userRequest);
//
//        ClientRegistration clientRegistration = userRequest.getClientRegistration();
//        String clientName = clientRegistration.getClientName();
//
//        log.info("클라이언트네임 : " + clientName);
//
//        OAuth2User oAuth2User = super.loadUser(userRequest);
//        Map<String, Object> paramMap = oAuth2User.getAttributes();
//
//        String ceoEmail = null;
//
//        switch (clientName) {
//            case "kakao" :
//                ceoEmail = getKakaoEmail(paramMap);
//                break;
//        }
//
//        log.info("이 메 일 : " + ceoEmail);
//
//        return ceoSecurityDTOGenerate(ceoEmail, paramMap);
//    }
//
//    // 소셜 회원 가입
//    private CeoSecurityDTO ceoSecurityDTOGenerate(String ceoEmail, Map<String, Object> params) {
//
//        Optional<Ceo> result = ceoRepository.findByCeoId(ceoEmail);
//
//        Set<GrantedAuthority> authorities = Set.of(new SimpleGrantedAuthority("ROLE_CEO"));
//
//        if (result.isEmpty()) {
//            String randomPassword = passwordEncoder.encode(randomPasswordGenerator.generateRandomPassword(8));
//            Ceo ceo = Ceo.builder()
//                    .ceoNo(null)
//                    .ceoId(ceoEmail)
//                    .ceoPw(randomPassword)
//                    .ceoName("dd")
//                    .ceoEmail(ceoEmail)
//                    .ceoPhone("dd")
//                    .businessNum("dd")
//                    .storeName("dd")
//                    .storeAddress("dd")
//                    .build();
//
//            ceo.addRole(CEO);
//            ceoRepository.save(ceo);
//
//            CeoSecurityDTO ceoSecurityDTO = new CeoSecurityDTO(
//                    null, ceoEmail, null, "dd", ceoEmail, "dd",
//                    "dd", "dd", "dd", authorities );
//
//            return ceoSecurityDTO;
//        } else {
//            Ceo ceo = result.get();
//
//            CeoSecurityDTO ceoSecurityDTO = new CeoSecurityDTO(
//                    ceo.getCeoNo(), ceo.getCeoName(), ceo.getCeoPw(), ceo.getCeoName(), ceo.getCeoEmail(),
//                    ceo.getCeoPhone(), ceo.getBusinessNum(), ceo.getStoreName(), ceo.getStoreAddress(), authorities);
//
//            ceoSecurityDTO.setProps(params);
//        }
//return null;
//    }
//
//    private String getKakaoEmail(Map<String, Object> paramMap) {
//
//        log.info("카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 카 카 오 ");
//
//        Object value = paramMap.get("kakao_account");
//
//        log.info("겟 카 카 오 어 카 운 트 : " + value);
//
//        LinkedHashMap accountMap = (LinkedHashMap)value;
//
//        String email = (String)accountMap.get("email");
//
//        log.info("이 메 일 이 메 일 이 메 일 이 메 일 이 메 일 이 메 일 이 메 일 이 메 일  : " + email);
//
//        return email;
//    }
//}
