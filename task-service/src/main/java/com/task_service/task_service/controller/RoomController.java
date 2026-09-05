package com.task_service.task_service.controller;

import com.task_service.task_service.dto.ChatRoomDTO;
import com.task_service.task_service.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("api/rooms")
public class RoomController {

    @Autowired
    private ChatService service;

    @PostMapping("add")
    public ResponseEntity<ChatRoomDTO> createRoom(@RequestBody ChatRoomDTO chatRoomDTO){
        return new ResponseEntity<>(service.createChatRoom(chatRoomDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("delete/{roomId}")
    public ResponseEntity<String> deleteChatRoom(@PathVariable String roomId) throws AccessDeniedException {
        Boolean succeed = service.deleteChatRoom(roomId);
        if (succeed)
            return new ResponseEntity<>("ChatRoom deleted successfully!", HttpStatus.OK);

        return new ResponseEntity<>("ChatRoom can not be deleted!!!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
