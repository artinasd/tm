package com.task_service.task_service.controller;

import com.task_service.task_service.dto.PublicTaskDTO;
import com.task_service.task_service.dto.TaskDTO;
import com.task_service.task_service.dto.TaskStatusDTO;
import com.task_service.task_service.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/tasks")
public class TaskController {

    @Autowired
    TaskService taskService;

    @PostMapping("add")
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) throws NoSuchAlgorithmException {
        return new ResponseEntity<>(taskService.createTask(taskDTO), HttpStatus.CREATED);
    }

    @GetMapping("{taskCode}")
    public ResponseEntity<PublicTaskDTO> getTaskByUnitCode(@PathVariable String taskCode) {
        return new ResponseEntity<>(taskService.getTaskByTaskCode(taskCode), HttpStatus.OK);
    }

    @GetMapping("{accountCode}")
    public ResponseEntity<List<PublicTaskDTO>> getAccountTasks(@PathVariable String accountCode,
                                                         @RequestParam String status){
        return new ResponseEntity<>(taskService.getTasksByAccountCode(accountCode, status), HttpStatus.OK);
    }

    @GetMapping("search")
    public ResponseEntity<List<PublicTaskDTO>> searchTask(@RequestParam String title,@RequestParam LocalDateTime createTime,@RequestParam LocalDateTime startTime,
                                                    @RequestParam String priority,@RequestParam TaskStatusDTO taskStatusDTO,
                                                    @RequestParam String ownerName,@RequestParam String responsibleName) {
        return new ResponseEntity<>(taskService.searchTask(title, createTime, startTime, priority, taskStatusDTO, ownerName, responsibleName), HttpStatus.OK);
    }

    @PatchMapping("edit/{taskCode}")
    public ResponseEntity<TaskDTO> editTask(@PathVariable String taskCode,
                                            @RequestBody TaskDTO dto) throws AccessDeniedException {
        return new ResponseEntity<>(taskService.editTask(taskCode, dto), HttpStatus.OK); // TODO : there is no need to unitCode
    }

    @DeleteMapping("delete/{taskCode}")
    public ResponseEntity<String> deleteTask(@PathVariable String taskCode) throws AccessDeniedException {
        taskService.deleteTask(taskCode);
        return new ResponseEntity<>("Task deleted successfully", HttpStatus.OK);
    }
}
