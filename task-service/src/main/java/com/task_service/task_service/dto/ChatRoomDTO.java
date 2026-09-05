package com.task_service.task_service.dto;

import com.task_service.task_service.entity.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class ChatRoomDTO {
    private Long id;
    private String roomCode;
    private String title;
    private String description;
    private String chatRoomID;
    private LocalDateTime createdAt;
    private Long lastMessageIndex;
    private AccountDTO creator;
    private ChatRoomType type;
    private List<URL> links;
    private List<String> messageCodes;
    private List<String> memberAccountCodes;
    private boolean deleted;
}
