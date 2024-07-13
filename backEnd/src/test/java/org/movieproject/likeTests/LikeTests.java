//package org.movieproject.likeTests;
//
//
//import lombok.extern.log4j.Log4j2;
//import org.junit.jupiter.api.Test;
//import org.movieproject.likes.dto.LikesDTO;
//import org.movieproject.likes.entity.Likes;
//import org.movieproject.likes.repository.LikesRepository;
//import org.movieproject.likes.service.LikesService;
//import org.movieproject.member.entity.Member;
//import org.movieproject.member.repository.MemberRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@Log4j2
//@SpringBootTest
//
//public class LikeTests {
//
//     /** 여기서 mock이라는걸 사용하는데 mcokito란? <br>
//     * - 단위 테스트를 위해 모의 객체를 생성하고 관리하는 데 사용되는 자바 오픈소스 프레임워크를 의미합니다.<br>
//     * - 이를 사용하면 실제 객체의 동작을 모방하는 모의 객체(Mock Object)를 생성하여 코드의 '특정 부분을 격리' 시키고 테스트하기 쉽게 만들어줍니다 <br> <br>
//     * - 주로 단일 컴포넌트의 동작을 테스트하는 데 사용되며 클래스 내의 개별 메서드나 함수, 서로 다른 클래스 또는 컴포넌트 간의 상호작용 객체들 간의 협업 등을 테스트할 수 있습니다.
//      *     <a href ="https://adjh54.tistory.com/346">설명 보러가기</a>
//     */
//     @Autowired
//    private LikesService likeService;
//     @Autowired
//    private MemberRepository memberRepository;
//
//     @Autowired
//    private LikesRepository likeRepository;
//
//    @Test
//    public void testAddLikeToExistingMember() {
//        // Given: 기존에 저장된 멤버 정보를 가져옴
//        Optional<Member> memberOptional = memberRepository.findById(1); // 기존 멤버의 ID를 사용하여 가져옴
//        Member member = memberOptional.orElseThrow(() -> new IllegalArgumentException("기존 멤버가 존재하지 않습니다."));
//
//        LikesDTO likeDTO = new LikesDTO();
//        likeDTO.setMemberNo(member.getMemberNo());
//        likeDTO.setLikeMovie("Inception");
//        // likeDTO.setLikeMovie({api:1});
//
//        // When: 좋아요 추가 기능 호출
//        Likes savedLike = likeService.addLikes(likeDTO);
//
//        // Then: 결과 검증
//        assertNotNull(savedLike);
//        assertEquals("Inception", savedLike.getLikeMovie());
//        assertEquals(member.getMemberNo(), savedLike.getMember().getMemberNo());
//
//        // 추가적으로, 실제 데이터베이스에 저장되었는지 확인할 수도 있음
//        Optional<Likes> retrievedLikeOptional = likeRepository.findById(savedLike.getLikeId());
//        assertTrue(retrievedLikeOptional.isPresent());
//        assertEquals("Inception", retrievedLikeOptional.get().getLikeMovie());
//        assertEquals(member.getMemberNo(), retrievedLikeOptional.get().getMember().getMemberNo());
//    }
//
//    @Test
//    public void testRemoveLikesByMember() {
//        // Given: 기존에 저장된 멤버 정보를 가져옴
//        Optional<Member> memberOptional = memberRepository.findById(6); // 기존 멤버의 ID를 사용하여 가져옴
//        Member member = memberOptional.orElseThrow(() -> new IllegalArgumentException("기존 멤버가 존재하지 않습니다."));
//
//        LikesDTO likeDTO1 = new LikesDTO();
//        likeDTO1.setMemberNo(member.getMemberNo());
//        likeDTO1.setLikeMovie("Inception");
//
//        LikesDTO likeDTO2 = new LikesDTO();
//        likeDTO2.setMemberNo(member.getMemberNo());
//        likeDTO2.setLikeMovie("Interstellar");
//
//        // 좋아요 추가 기능 호출
//        Likes savedLike1 = likeService.addLikes(likeDTO1);
//        Likes savedLike2 = likeService.addLikes(likeDTO2);
//
//        // When: 사용자의 모든 좋아요 삭제 기능 호출
//        likeService.removeLikesByMember(member.getMemberNo());
//
//        // Then: 결과 검증
//        List<Likes> likes = likeService.getLikesByMember(member.getMemberNo());
//        assertTrue(likes.isEmpty(), "사용자의 좋아요가 모두 삭제되지 않았습니다.");
//    }
//
//
//}
