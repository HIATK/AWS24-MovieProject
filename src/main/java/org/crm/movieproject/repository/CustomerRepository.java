package org.crm.movieproject.repository;

import org.crm.movieproject.domain.user;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<user, Integer> {
    // 로그인시 아이디와 권한 확인용
    @EntityGraph(attributePaths = "roleSet")
    @Query("select m from user m where m.userId = :customerId")
    Optional<user> getWithRoles(String userId);

    // 아이디 중복 확인
    boolean existsByCustomerId (String customerId);

    // 회원 정보 수정
    @Modifying
    @Transactional
    @Query("update user c set c.pw = :re_pw, c.userName = :re_name, c.user = :re_email, " +
            "c.customerPhone = :re_phone, c.customerNick = :re_nick  where c.customerId = :customer_id")
    void updateCustomer(@Param("re_pw") String pw, @Param("re_name")String name, @Param("re_email")String email,
                   @Param("re_phone")String phone, @Param("re_nick")String nick, @Param("customer_id")String id );

    // 비밀번호 가져오기
    @Query("select c.pw from user c where c.userId = :customerId")
    String findCustomerPwByCustomerId(@Param("customerId") String customerId);

    // db 삭제
    @Modifying
    @Transactional
    @Query("delete from user m where m.userId = :customerId")
    void customerDelete(@Param("customerId") String customerId);

}
