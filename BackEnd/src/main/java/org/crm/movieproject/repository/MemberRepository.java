package org.crm.movieproject.repository;


import org.crm.movieproject.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    @Query("select m from Member m where m.memberEmail = :memberEmail")
    Optional<Member> FindByMemberEmail(String memberEmail);

}
