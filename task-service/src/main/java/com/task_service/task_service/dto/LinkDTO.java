package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URL;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class LinkDTO {
    private URL url;
    private LocalDateTime createAt;
    private LocalDateTime expiresAt;
    private Long usage;
    private LinkTypeDTO linkType;
    private ChatRoomDTO chatRoom;
    private AccountDTO creator;
    private AccountDTO targetAccount;
}
