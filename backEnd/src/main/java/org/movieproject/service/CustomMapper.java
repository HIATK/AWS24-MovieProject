package org.movieproject.service;

import lombok.Getter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.movieproject.domain.Member;
import org.movieproject.dto.MemberDTO;
import org.springframework.stereotype.Component;

@Getter
@Component
public class CustomMapper {

    private final ModelMapper modelMapper;

    public CustomMapper() {
        this.modelMapper = new ModelMapper();
        configureMappings();
    }

    private void configureMappings() {
        // MemberDTO -> Member 매핑 설정
        modelMapper.addMappings(new PropertyMap<MemberDTO, Member>() {
            @Override
            protected void configure() {
                map().setMemberEmail(source.getMemberEmail());
                map().setMemberPw(source.getMemberPw());
                map().setMemberName(source.getMemberName());
                map().setMemberPhone(source.getMemberPhone());
                map().setMemberNick(source.getMemberNick());
                // 추가 필드 매핑이 필요한 경우 여기에 추가
            }
        });
    }

}
