package com.task_service.task_service.repository;

import com.task_service.task_service.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Membership findByAccount_AccountCodeAndChatRoom_RoomCode(String accountCode, String roomCode);
}
