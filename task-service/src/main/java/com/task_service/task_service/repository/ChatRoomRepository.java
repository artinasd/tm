package com.task_service.task_service.repository;

import com.task_service.task_service.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    ChatRoom findByChatRoomID(String roomID);

    ChatRoom findByRoomCode(String roomCode);
}
