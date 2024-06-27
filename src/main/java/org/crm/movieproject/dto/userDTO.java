package org.crm.movieproject.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class userDTO {
    private int id;

    private String userId;

    private String pw;

    private String email;

    private String phoneNum;


}
