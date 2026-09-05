package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.ChatMessageDTO;
import com.task_service.task_service.entity.ChatMessage;
import com.task_service.task_service.repository.AccountRepository;
import com.task_service.task_service.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageMapper {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private ChatRoomRepository roomRepository;

    public ChatMessageDTO toDTO(ChatMessage chatMessage){
        ChatMessageDTO dto = new ChatMessageDTO();

        if (chatMessage.getId() != null) dto.setId(chatMessage.getId());
        if (chatMessage.getMessage() != null && !chatMessage.getMessage().isEmpty()) dto.setMessage(chatMessage.getMessage());
        if (chatMessage.getMessageCode() != null && !chatMessage.getMessageCode().isEmpty()) dto.setMessageCode(chatMessage.getMessageCode());
        if (chatMessage.getChatRoom() != null) dto.setChatRoomCode(chatMessage.getChatRoom().getRoomCode());
        if (chatMessage.getPinTime() != null) dto.setPinTime(chatMessage.getPinTime());
        if (chatMessage.getTimestamp() != null) dto.setTimestamp(chatMessage.getTimestamp());
        if (chatMessage.getRepliedMessageId() != null && !chatMessage.getRepliedMessageId().isEmpty()) dto.setRepliedMessageId(chatMessage.getRepliedMessageId());
        if (chatMessage.getSender() != null) dto.setSender(accountMapper.transferEntityToPublicDTO(chatMessage.getSender()));
        dto.setUpdateAt(chatMessage.getUpdateAt());
        dto.setStatus(chatMessage.getStatus());
        dto.setForwarded(chatMessage.isForwarded());
        dto.setDeleted(chatMessage.isDeleted());

        return dto;
    }

    public ChatMessage toEntity(ChatMessageDTO dto){
        ChatMessage chatMessage = new ChatMessage();

        if (dto.getId() != null) chatMessage.setId(dto.getId());
        if (dto.getMessageCode() != null && !dto.getMessageCode().isEmpty()) chatMessage.setMessageCode(dto.getMessageCode());
        if (dto.getMessage() != null && !dto.getMessage().isEmpty()) chatMessage.setMessage(dto.getMessage());
        if (dto.getChatRoomCode() != null) chatMessage.setChatRoom(roomRepository.findByRoomCode(dto.getChatRoomCode()));
        if (dto.getPinTime() != null) chatMessage.setPinTime(dto.getPinTime());
        if (dto.getTimestamp() != null) chatMessage.setTimestamp(dto.getTimestamp());
        if (dto.getRepliedMessageId() != null && !dto.getRepliedMessageId().isEmpty()) chatMessage.setRepliedMessageId(dto.getRepliedMessageId());
        if (dto.getSender() != null) chatMessage.setSender(accountRepository.findByAccountCode(dto.getSender().getAccountCode()));
        chatMessage.setUpdateAt(dto.getUpdateAt());
        chatMessage.setStatus(dto.getStatus());
        chatMessage.setForwarded(dto.isForwarded());
        chatMessage.setDeleted(dto.isDeleted());

        return chatMessage;
    }
}
