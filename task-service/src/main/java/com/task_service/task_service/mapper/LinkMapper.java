package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.LinkDTO;
import com.task_service.task_service.entity.Link;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LinkMapper {

    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private ChatRoomMapper roomMapper;

    public LinkDTO toDTO(Link link){
        LinkDTO dto = new LinkDTO();

        if (link.getUrl() != null) dto.setUrl(link.getUrl());
        if (link.getCreator() != null) dto.setCreator(accountMapper.toDTO(link.getCreator()));
        if (link.getChatRoom() != null) dto.setChatRoom(roomMapper.toDTO(link.getChatRoom()));
        if (link.getCreateAt() != null) dto.setCreateAt(link.getCreateAt());
        if (link.getLinkType() != null) dto.setLinkType(LinkTypeMapper.toDTO(link.getLinkType()));
        if (link.getUsage() != null) dto.setUsage(link.getUsage());
        if (link.getExpiresAt() != null) dto.setExpiresAt(link.getExpiresAt());
        if (link.getTargetAccount() != null) dto.setTargetAccount(accountMapper.toDTO(link.getTargetAccount()));

        return dto;
    }

    public Link toEntity(LinkDTO dto){
        Link link = new Link();

        if (dto.getUrl() != null) link.setUrl(dto.getUrl());
        if (dto.getCreator() != null) link.setCreator(accountMapper.toEntity(dto.getCreator()));
        if (dto.getChatRoom() != null) link.setChatRoom(roomMapper.toEntity(dto.getChatRoom()));
        if (dto.getCreateAt() != null) link.setCreateAt(dto.getCreateAt());
        if (dto.getLinkType() != null) link.setLinkType(LinkTypeMapper.toEntity(dto.getLinkType()));
        if (dto.getUsage() != null) link.setUsage(dto.getUsage());
        if (dto.getExpiresAt() != null) link.setExpiresAt(dto.getExpiresAt());
        if (dto.getTargetAccount() != null) link.setTargetAccount(accountMapper.toEntity(dto.getTargetAccount()));

        return link;
    }
}
