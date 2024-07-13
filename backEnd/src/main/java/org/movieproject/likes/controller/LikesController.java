package org.movieproject.likes.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.movieproject.likes.dto.LikesDTO;
import org.movieproject.likes.service.LikesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/likes")
public class LikesController {

    private final LikesService likesService;

    @PostMapping
    public ResponseEntity<String> likeMovie(@RequestBody LikesDTO likesDTO) {
        likesService.toggleLike(likesDTO);
        return ResponseEntity.ok("Like status updated successfully");
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> getLikeStatus(@RequestParam Integer memberNo, @RequestParam Integer movieId) {
        boolean liked = likesService.getLikeStatus(memberNo, movieId);
        return ResponseEntity.ok(liked);
    }
}
