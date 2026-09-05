package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class MembershipDTO {
    private Long id;
    private ChatRoomDTO chatRoom;
    private AccountDTO account;
    private LocalDateTime joinedAt;
    private LocalDateTime lastReadAt;
    private boolean mute;
    private Boolean isDeleted;
}
