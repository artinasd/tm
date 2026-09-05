package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.LinkTypeDTO;
import com.task_service.task_service.entity.LinkType;
import org.springframework.stereotype.Component;

@Component
public class LinkTypeMapper {
    public static LinkTypeDTO toDTO(LinkType linkType){
        LinkTypeDTO dto = new LinkTypeDTO();

        dto.setType(linkType.getType());

        return dto;
    }

    public static LinkType toEntity(LinkTypeDTO dto){
        LinkType linkType = new LinkType();

        linkType.setType(dto.getType());

        return linkType;
    }
}
