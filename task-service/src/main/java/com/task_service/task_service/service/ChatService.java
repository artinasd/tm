package com.task_service.task_service.service;

import com.task_service.task_service.dto.ChatMessageDTO;
import com.task_service.task_service.dto.ChatRoomDTO;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;

@Service
public interface ChatService {

    ChatMessageDTO sendMessage(ChatMessageDTO chatMessageDTO);

    ChatRoomDTO createChatRoom(ChatRoomDTO chatRoomDTO);

    Boolean deleteChatRoom(String roomId) throws AccessDeniedException;

    ChatMessageDTO editMessage(ChatMessageDTO messageDTO) throws AccessDeniedException;

    void deleteMessage(String messageCode, Boolean forAll) throws AccessDeniedException;
}
