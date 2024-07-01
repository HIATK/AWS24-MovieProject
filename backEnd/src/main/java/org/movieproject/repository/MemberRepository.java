package org.movieproject.repository;


import org.movieproject.domain.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    @EntityGraph(attributePaths = "roleSet")
    @Query("select m from Member m where m.memberEmail = :memberEmail")
    Optional<Member> FindByMemberEmailWithRoles(String memberEmail);

    // 아이디 중복 확인
    boolean existsByMemberEmail(String memberEmail);

}
