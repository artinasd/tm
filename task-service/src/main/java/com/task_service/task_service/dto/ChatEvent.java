package com.task_service.task_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatEvent {
    private ChatEventType type;
    private ChatMessageDTO message;
}
