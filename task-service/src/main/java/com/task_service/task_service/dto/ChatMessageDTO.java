package com.task_service.task_service.dto;

import com.task_service.task_service.entity.MessageStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ChatMessageDTO {
    private Long id;
    private String messageCode;
    private String message;
    private LocalDateTime timestamp;
    private LocalDateTime updateAt;
    private LocalDateTime pinTime;
    private boolean forwarded;
    private MessageStatus status;
    private String repliedMessageId;
    private PublicAccountDTO sender;
    private String chatRoomCode;
    private boolean deleted;
}
