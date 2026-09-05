package com.task_service.task_service.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomCode;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Column(unique = true)
    private String chatRoomID; // Set an id for it, but if the admin sets an id change it to that

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Long lastMessageIndex;

    @Column
    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn
    private Unit unit;

    @ManyToOne
    @JoinColumn
    private Account creator;

    @ManyToOne
    @JoinColumn(nullable = false)
    private ChatRoomType type;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private List<Link> links;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private List<ChatMessage> messages;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private List<Membership> members;

    @Column
    private boolean deleted;

}
