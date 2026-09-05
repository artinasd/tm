package com.task_service.task_service.controller;

import com.task_service.task_service.dto.ChatMessageDTO;
import com.task_service.task_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;

@RestController
@RequiredArgsConstructor
public class ChatController {

    @Autowired
    private ChatService service;

    @MessageMapping("app/chat.sendMessage")
    public ChatMessageDTO sendMessage(ChatMessageDTO messageDTO){
        return service.sendMessage(messageDTO);
    }

    @MessageMapping("app/chat.editMessage")
    public ChatMessageDTO editMessage(ChatMessageDTO messageDTO) throws AccessDeniedException {
        return service.editMessage(messageDTO);
    }

    @MessageMapping("app/chat.deleteMessage")
    public void deleteMessage(String messageCode, Boolean forAll) throws AccessDeniedException {
        service.deleteMessage(messageCode, forAll);
    }

}
