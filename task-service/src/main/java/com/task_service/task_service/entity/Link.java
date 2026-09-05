package com.task_service.task_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URL;
import java.time.LocalDateTime;

@Data
@Entity
@Table
@NoArgsConstructor
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private URL url;

    @Column(nullable = false)
    private LocalDateTime createAt;

    @Column
    private LocalDateTime expiresAt;

    @Column
    private Long usage;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private LinkType linkType;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Account creator;

    @ManyToOne
    @JoinColumn(name = "target_id")
    private Account targetAccount;

}
