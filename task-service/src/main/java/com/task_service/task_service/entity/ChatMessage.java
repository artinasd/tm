package com.task_service.task_service.entity;

import com.task_service.task_service.dto.LTreeType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

@Entity
@Table
@Data
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String messageCode;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private LocalDateTime updateAt;

    @Column
    private LocalDateTime pinTime;

    @Column
    private boolean forwarded;

    @Enumerated(EnumType.STRING)
    private MessageStatus status;

    @Type(LTreeType.class)
    @Column(columnDefinition = "ltree")
    private String repliedMessageId; //Includes the current message itself

    @ManyToOne
    @JoinColumn(nullable = false)
    private Account sender;

    @ManyToOne
    @JoinColumn
    private ChatRoom chatRoom;

    @Column
    private boolean deleted;

}
