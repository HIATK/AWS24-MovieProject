package org.crm.movieproject.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.crm.movieproject.domain.user;
import org.crm.movieproject.repository.CustomerRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class CrmUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("loadUserByUsername : " + username);

        // 일반 사용자 검색
        Optional<user> customerResult = customerRepository.getWithRoles(username);
        if (customerResult.isPresent()) {
            user customer = customerResult.get();
            CustomerSecurityDTO customerSecurityDTO = new CustomerSecurityDTO(
                    customer.getCustomerNo(),
                    customer.getCustomerId(),
                    customer.getCustomerPw(),
                    customer.getCustomerName(),
                    customer.getCustomerGender(),
                    customer.getCustomerEmail(),
                    customer.getCustomerPhone(),
                    customer.getCustomerNick(),
                    customer.getRoleSet().stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                            .collect(Collectors.toList())
            );

            log.info("Customer 시큐리티 DTO: " + customerSecurityDTO);
            return customerSecurityDTO;
        }



        throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
    }

}