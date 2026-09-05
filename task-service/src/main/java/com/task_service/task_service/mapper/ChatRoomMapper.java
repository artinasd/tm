package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.ChatRoomDTO;
import com.task_service.task_service.entity.ChatMessage;
import com.task_service.task_service.entity.ChatRoom;
import com.task_service.task_service.entity.Link;
import com.task_service.task_service.entity.Membership;
import com.task_service.task_service.repository.ChatMessageRepository;
import com.task_service.task_service.repository.LinkRepository;
import com.task_service.task_service.repository.MembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ChatRoomMapper {

    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private LinkRepository linkRepository;
    @Autowired
    private MembershipRepository membershipRepository;
    @Autowired
    private ChatMessageRepository messageRepository;

    public ChatRoomDTO toDTO(ChatRoom chatRoom){
        ChatRoomDTO dto = new ChatRoomDTO();

        if (chatRoom.getId() != null) dto.setId(chatRoom.getId());
        if (chatRoom.getRoomCode() != null && !chatRoom.getRoomCode().isEmpty()) dto.setRoomCode(chatRoom.getRoomCode());
        if (chatRoom.getTitle() != null && !chatRoom.getTitle().isEmpty()) dto.setTitle(chatRoom.getTitle());
        if (chatRoom.getDescription() != null && !chatRoom.getDescription().isEmpty()) dto.setDescription(chatRoom.getDescription());
        if (chatRoom.getCreator() != null) dto.setCreator(accountMapper.toDTO(chatRoom.getCreator()));
        if (chatRoom.getCreatedAt() != null) dto.setCreatedAt(chatRoom.getCreatedAt());
        if (chatRoom.getMessages() != null && !chatRoom.getMessages().isEmpty()){
            List<ChatMessage> messages = chatRoom.getMessages();
            List<String> messageCodes = new ArrayList<>();

            for (ChatMessage message : messages)
                messageCodes.add(message.getMessageCode());

            dto.setMessageCodes(messageCodes);
        }
        if (chatRoom.getLinks() != null){
            List<Link> links = chatRoom.getLinks();
            List<URL> linkUrls = new ArrayList<>();

            for (Link link : links)
                linkUrls.add(link.getUrl());

            dto.setLinks(linkUrls);
        }
        if (chatRoom.getMembers() != null) {
            List<Membership> members = chatRoom.getMembers();
            List<String> memberCodes = new ArrayList<>();

            for (Membership member : members)
                memberCodes.add(member.getAccount().getAccountCode());

            dto.setMemberAccountCodes(memberCodes);
        }
        dto.setType(chatRoom.getType());
        dto.setDeleted(chatRoom.isDeleted());

        return dto;
    }

    public ChatRoom toEntity(ChatRoomDTO dto){
        ChatRoom chatRoom = new ChatRoom();

        if (dto.getId() != null) chatRoom.setId(dto.getId());
        if (dto.getRoomCode() != null && !dto.getRoomCode().isEmpty()) chatRoom.setRoomCode(dto.getRoomCode());
        if (dto.getTitle() != null && !dto.getTitle().isEmpty()) chatRoom.setTitle(dto.getTitle());
        if (dto.getDescription() != null && !dto.getDescription().isEmpty()) chatRoom.setDescription(dto.getDescription());
        if (dto.getCreator() != null) chatRoom.setCreator(accountMapper.toEntity(dto.getCreator()));
        if (dto.getCreatedAt() != null) chatRoom.setCreatedAt(dto.getCreatedAt());
        if (dto.getMessageCodes() != null && !dto.getMessageCodes().isEmpty()){
            List<String> messageCodes = dto.getMessageCodes();
            List<ChatMessage> messages = new ArrayList<>();

            for (String messageCode : messageCodes)
                messages.add(messageRepository.findByMessageCode(messageCode));

            chatRoom.setMessages(messages);
        }
        if (dto.getLinks() != null && !dto.getLinks().isEmpty()){
            List<URL> linkUrls = dto.getLinks();
            List<Link> links = new ArrayList<>();

            for (URL url : linkUrls)
                links.add(linkRepository.findByUrl(url));

            chatRoom.setLinks(links);
        }
        if (dto.getMemberAccountCodes() != null && !dto.getMemberAccountCodes().isEmpty()) {
            List<String> memberCodes = dto.getMemberAccountCodes();
            List<Membership> members = new ArrayList<>();

            for (String memberCode : memberCodes)
                members.add(membershipRepository.findByAccount_AccountCodeAndChatRoom_RoomCode(memberCode, dto.getRoomCode()));

            chatRoom.setMembers(members);
        }
        chatRoom.setType(dto.getType());
        chatRoom.setDeleted(dto.isDeleted());

        return chatRoom;
    }
}
