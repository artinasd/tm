package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.*;
import com.task_service.task_service.entity.ChatMessage;
import com.task_service.task_service.entity.ChatRoom;
import com.task_service.task_service.entity.MessageStatus;
import com.task_service.task_service.exception.EntityNotFound;
import com.task_service.task_service.mapper.ChatMessageMapper;
import com.task_service.task_service.mapper.ChatRoomMapper;
import com.task_service.task_service.repository.AccountRepository;
import com.task_service.task_service.repository.ChatMessageRepository;
import com.task_service.task_service.repository.ChatRoomRepository;
import com.task_service.task_service.repository.ChatRoomTypeRepository;
import com.task_service.task_service.security.ActionType;
import com.task_service.task_service.security.AuthorizationManager;
import com.task_service.task_service.service.ChatService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ChatServiceImpl implements ChatService {

    @PersistenceContext
    private final EntityManager entityManager;

    private final ChatMessageRepository messageRepository;
    private final ChatRoomRepository roomRepository;
    private final AccountRepository accountRepository;
    private final ChatRoomTypeRepository roomTypeRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final ChatRoomMapper chatRoomMapper;
    private final AuthorizationManager authorizationManager;

    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    @Override
    public ChatMessageDTO sendMessage(ChatMessageDTO chatMessageDTO) {
        ChatMessage message = chatMessageMapper.toEntity(chatMessageDTO);

        setMessageDetails(message);

        messageRepository.save(message);

        ChatEvent chatEvent = new ChatEvent(ChatEventType.SEND_MESSAGE, chatMessageMapper.toDTO(message));

        broadcastMessage(chatEvent);

        return chatMessageMapper.toDTO(message);
    }

    private void broadcastMessage(ChatEvent chatEvent) {
        String roomCode = roomRepository.findByRoomCode(chatEvent.getMessage().getChatRoomCode()).getRoomCode();
        messagingTemplate.convertAndSend("/room/" + roomCode, chatEvent);
    }

    private void setMessageDetails(ChatMessage message) {
        ChatRoom room = roomRepository.findById(message.getChatRoom().getId())
                .orElseThrow(() -> new EntityNotFound("Chat Room", "ID", message.getChatRoom().getId()));

        String messageCode = room.getRoomCode() + entityManager.createNativeQuery(
                "SELECT nextval(room_" + room.getRoomCode() + "_message_seq)"
        ).executeUpdate();

        message.setChatRoom(room);
        room.getMessages().add(message);

        String senderAccountCode = message.getSender().getAccountCode();
        message.setSender(accountRepository.findByAccountCode(senderAccountCode));
        if (message.getSender() == null)
            throw new EntityNotFound("Account", "AccountCode", senderAccountCode);

        message.setTimestamp(LocalDateTime.now());
        message.setStatus(MessageStatus.SENT);
    }

    @Transactional
    @Override
    public ChatRoomDTO createChatRoom(ChatRoomDTO chatRoomDTO) {
        ChatRoom chatRoom = chatRoomMapper.toEntity(chatRoomDTO);

        SetRoomDetails(chatRoom);

        roomRepository.save(chatRoom);

        return chatRoomMapper.toDTO(chatRoom);
    }

    private void SetRoomDetails(ChatRoom chatRoom) {
        chatRoom.setCreatedAt(LocalDateTime.now());

        chatRoom.setRoomCode(("Room_" + UUID.randomUUID()).replace("_", "-"));

        if (chatRoom.getChatRoomID() == null && chatRoom.getChatRoomID().isEmpty()){
            String roomId = entityManager.createNativeQuery(
                    "SELECT nextval('global_chat_room_id_seq')"
            ).getSingleResult().toString();
            chatRoom.setChatRoomID(roomId);
        }

        final String SEQ_NAME = "room_" + chatRoom.getRoomCode() + "_message_seq";
        entityManager.createNativeQuery(
                "CREATE SEQUENCE " + SEQ_NAME + " START 1 INCREMENT 1 MINVALUE 1 CACHE 1"
        ).executeUpdate();

        chatRoom.setCreatedAt(LocalDateTime.now());

        chatRoom.setLastMessageIndex(0L);

        chatRoom.setCreator(accountRepository.findByAccountCode(chatRoom.getCreator().getAccountCode()));

        chatRoom.setType(roomTypeRepository.findByType(chatRoom.getType().getType()));

        chatRoom.setDeleted(false);
    }

    @Transactional
    @Override
    public Boolean deleteChatRoom(String roomId) throws AccessDeniedException {
        ChatRoom room = roomRepository.findByChatRoomID(roomId);
        if (room == null)
            throw new EntityNotFound("ChatRoom", "RoomID", roomId);

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authorizationManager.checkAccess(userDetails.getUsername(), roomId, room.getCreator().getAccountCode(), ActionType.DELETE_CHATROOM);

        room.setDeleted(true);
        roomRepository.save(room);

        return true;
    }

    @Override
    public ChatMessageDTO editMessage(ChatMessageDTO messageDTO) throws AccessDeniedException {
        ChatMessage message = messageRepository.findByMessageCode(messageDTO.getMessageCode());
        if (message == null)
            throw new EntityNotFound("Message", "Message Code", messageDTO.getMessageCode());

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authorizationManager.checkAccess(userDetails.getUsername(), message.getChatRoom().getRoomCode(), message.getSender().getAccountCode(), ActionType.EDIT_MESSAGE);


        updateMessage(message, messageDTO);

        //Broadcasting
        messageDTO = chatMessageMapper.toDTO(message);
        broadcastMessage(new ChatEvent(ChatEventType.EDIT_MESSAGE, messageDTO));

        return chatMessageMapper.toDTO(message);
    }

    private void updateMessage(ChatMessage message, ChatMessageDTO messageDTO) {
        if (message.getMessage().strip().equals(messageDTO.getMessage().strip())) {
            message.setMessage(messageDTO.getMessage().strip());
            message.setUpdateAt(LocalDateTime.now());
        }
        else
            throw new RuntimeException();
    }

    @Transactional
    @Override
    public void deleteMessage(String messageCode, Boolean forAll) throws AccessDeniedException {
        ChatMessage message = messageRepository.findByMessageCode(messageCode);

        if (message == null)
            throw new EntityNotFound("Message", "Message Code", messageCode);

        String clientID = SecurityContextHolder.getContext().getAuthentication().getName();

        if (forAll)
            authorizationManager.checkAccess(clientID, message.getChatRoom().getRoomCode(), message.getSender().getAccountCode(), ActionType.DELETE_MESSAGE_FORALL);
        else
            authorizationManager.checkAccess(clientID, message.getChatRoom().getRoomCode(), message.getSender().getAccountCode(), ActionType.DELETE_MESSAGE);

        messageRepository.delete(message);
        messageRepository.flush();

        ChatMessageDTO deletedMessage = new ChatMessageDTO();
        deletedMessage.setMessageCode(messageCode);
        broadcastMessage(new ChatEvent(ChatEventType.DELETE_MESSAGE, deletedMessage));
    }
}

/*
        String seqName = "chat_" + message.getId() + "_seq";

        entityManager.createNativeQuery(
                "CREATE SEQUENCE " + seqName + " START 1 INCREMENT 1 MINVALUE 1 CACHE 1"
        ).executeUpdate();
 */
