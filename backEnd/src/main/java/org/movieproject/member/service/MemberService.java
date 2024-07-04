package org.movieproject.member.service;


import org.movieproject.member.dto.MemberDTO;

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

}
