package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.MembershipDTO;
import com.task_service.task_service.entity.Membership;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MembershipMapper {

    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private ChatRoomMapper roomMapper;

    public MembershipDTO toDTO(Membership membership){
        MembershipDTO dto = new MembershipDTO();

        if (membership.getId() != null) dto.setId(membership.getId());
        if (membership.getAccount() != null) dto.setAccount(accountMapper.toDTO(membership.getAccount()));
        if (membership.getChatRoom() != null) dto.setChatRoom(roomMapper.toDTO(membership.getChatRoom()));
        if (membership.getJoinedAt() != null) dto.setJoinedAt(membership.getJoinedAt());
        if (membership.getLastReadAt() != null) dto.setLastReadAt(membership.getLastReadAt());
        dto.setMute(membership.isMute());
        dto.setIsDeleted(membership.getIsDeleted());

        return dto;
    }

    public Membership toEntity(MembershipDTO dto){
        Membership membership = new Membership();

        if (dto.getId() != null) membership.setId(dto.getId());
        if (dto.getAccount() != null) membership.setAccount(accountMapper.toEntity(dto.getAccount()));
        if (dto.getChatRoom() != null) membership.setChatRoom(roomMapper.toEntity(dto.getChatRoom()));
        if (dto.getJoinedAt() != null) membership.setJoinedAt(dto.getJoinedAt());
        if (dto.getLastReadAt() != null) membership.setLastReadAt(dto.getLastReadAt());
        membership.setMute(dto.isMute());
        membership.setIsDeleted(dto.getIsDeleted());

        return membership;
    }
}
