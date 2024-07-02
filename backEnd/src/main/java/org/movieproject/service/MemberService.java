package org.movieproject.service;


import org.movieproject.dto.MemberDTO;

public interface MemberService {

    // 아이디 중복확인
    public class MidExistException extends Exception {
        public MidExistException() {
            super();
        }
        public MidExistException(String message) {
            super(message);
        }
    }

    // 회원가입
    void memberJoin(MemberDTO memberDTO) throws MemberService.MidExistException;

    // 회원 이메일 참조하여 DTO 반환하는 서비스
//    MemberDTO findMemberByEmail(String email);
}
