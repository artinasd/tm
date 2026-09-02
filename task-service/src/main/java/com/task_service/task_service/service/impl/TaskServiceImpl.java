package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.EmploymentDTO;
import com.task_service.task_service.dto.PublicTaskDTO;
import com.task_service.task_service.dto.TaskDTO;
import com.task_service.task_service.dto.TaskStatusDTO;
import com.task_service.task_service.entity.Task;
import com.task_service.task_service.entity.TaskStatus;
import com.task_service.task_service.exception.EntityNotFound;
import com.task_service.task_service.mapper.*;
import com.task_service.task_service.repository.*;
import com.task_service.task_service.security.ActionType;
import com.task_service.task_service.security.AuthorizationManager;
import com.task_service.task_service.service.RescheduleService;
import com.task_service.task_service.service.TaskService;
import com.task_service.task_service.service.TaskStatusService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repository;
    private final TaskMapper mapper;
    private final AuthorizationManager authorizationManager;
    private final EmploymentRepository employmentRepository;
    private final AccountRepository accountRepository;
    private final UnitRepository unitRepository;
    private final TaskStatusRepository statusRepository;
    private final TaskStatusTypeRepository statusTypeRepository;
    private final TaskStatusService taskStatusService;
    private final RescheduleService rescheduleService;
    private final TaskStatusTypeMapper typeMapper;
    private final TaskStatusMapper taskStatusMapper;

    private final Logger logger = LoggerFactory.getLogger(TaskServiceImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {

        Task task = mapper.toEntity(taskDTO);

        setDetails(task);

        repository.saveAndFlush(task);

        return mapper.toDTO(task);
    }

    private void setDetails(Task task) {
        // Task Code
        String taskCode = ("Task_" + UUID.randomUUID()).replace("-", "_");
        task.setTaskCode(taskCode);

        // Create time
        task.setCreateTime(LocalDateTime.now());

        // Owner
        task.setOwner(employmentRepository.findByUnit_UnitCodeAndEmployee_Account_AccountCode(task.getUnit().getUnitCode(), task.getOwner().getEmployee().getAccount().getAccountCode()));

        // Responsible
        task.setResponsible(employmentRepository.findByUnit_UnitCodeAndEmployee_Account_AccountCode(task.getUnit().getUnitCode(), task.getResponsible().getEmployee().getAccount().getAccountCode()));

        // Unit
        task.setUnit(unitRepository.findByUnitCode(task.getUnit().getUnitCode()));

        // Task Status
        TaskStatusDTO statusDTO = new TaskStatusDTO();
        statusDTO.setTime(LocalDateTime.now());
        statusDTO.setTaskCode(taskCode);
        statusDTO.setTaskStatusType(typeMapper.toDTO(statusTypeRepository.findByType(task.getTaskStatus().getTaskStatusType().getType())));
        taskStatusService.createTaskStatus(statusDTO);
        task.setTaskStatus(statusRepository.findByTaskCode(taskCode));

        // Task Status History
        List<TaskStatus> taskStatusList = task.getTaskStatusHistory();
        if (taskStatusList != null && !taskStatusList.isEmpty()){
            taskStatusList.add(task.getTaskStatus());
            task.setTaskStatusHistory(taskStatusList);
        }
        else {
            taskStatusList = new ArrayList<>();
            taskStatusList.add(task.getTaskStatus());
            task.setTaskStatusHistory(taskStatusList);
        }

        // Task Path
        if (task.getTaskPath() != null && !task.getTaskPath().isEmpty())
            task.setTaskPath(task.getTaskPath() + "." + taskCode);
        else
            task.setTaskPath(taskCode);

        // Task Weight is set
    }

    @Override
    public PublicTaskDTO getTaskByTaskCode(String taskCode) {

        Task task = repository.findByTaskCode(taskCode);

        return mapper.transferEntityToPublic(task);
    }

    @Override
    public List<PublicTaskDTO> getTasksByAccountCode(String accountCode, String status) {
        if (accountRepository.findByAccountCode(accountCode) == null)
            throw new EntityNotFound("Account", "account code", accountCode);

        List<Task> tasks = repository.findAccountsTasks(accountCode, status);
        if (tasks.isEmpty())
            return null;

        return tasks.stream()
                .map(mapper::transferEntityToPublic)
                .collect(Collectors.toList());
    }

    @Override
    public List<PublicTaskDTO> searchTask(String title, LocalDateTime createTime, LocalDateTime startTime,
                                          String priority, TaskStatusDTO taskStatusDTO,
                                          String ownerName, String responsibleName) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Task> cq = cb.createQuery(Task.class);
        Root<Task> root = cq.from(Task.class);
        List<Predicate> predicates = new ArrayList<>();

        if (title != null && !title.isEmpty())
            predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));

        if (createTime != null)
            predicates.add(cb.equal(root.get("createTime"),createTime));

        if (startTime != null)
            predicates.add(cb.equal(root.get("startTime"), startTime));

        if (priority != null && !predicates.isEmpty())
            predicates.add(cb.equal(root.get("priority"), priority));

        if (taskStatusDTO != null)
            predicates.add(cb.equal(root.get("taskStatus").get("taskStatusType").get("type"), taskStatusDTO.getTaskStatusType().getType()));

        if (ownerName != null) {
            Predicate accountName = cb.like(cb.lower(root.get("owner").get("employee").get("account").get("accountName")), "%" + ownerName.toLowerCase() + "%");
            Predicate accountID = cb.like(cb.lower(root.get("owner").get("employee").get("accountID")), "%" + ownerName.toLowerCase() + "%");
            Predicate firstName = cb.like(cb.lower(root.get("owner").get("employee").get("account").get("firstName")), "%" + ownerName.toLowerCase() + "%");
            Predicate lastName = cb.like(cb.lower(root.get("owner").get("employee").get("account").get("lastName")), "%" + ownerName.toLowerCase() + "%");
            predicates.add(cb.or(accountName, accountID, firstName, lastName));
        }

        if (responsibleName != null) {
            Predicate accountName = cb.like(cb.lower(root.get("responsible").get("employee").get("account").get("accountName")), "%" + responsibleName.toLowerCase() + "%");
            Predicate accountID = cb.like(cb.lower(root.get("responsible").get("employee").get("account").get("accountID")), "%" + responsibleName.toLowerCase() + "%");
            Predicate firstName = cb.like(cb.lower(root.get("responsible").get("employee").get("account").get("firstName")), "%" + responsibleName.toLowerCase() + "%");
            Predicate lastName = cb.like(cb.lower(root.get("responsible").get("employee").get("account").get("lastName")), "%" + responsibleName.toLowerCase() + "%");
            predicates.add(cb.or(accountName, accountID, firstName, lastName));
        }

        cq.where(cb.and(predicates.toArray(new Predicate[0])));

        return entityManager.createQuery(cq).getResultList()
            .stream()
            .map(mapper::transferEntityToPublic)
            .collect(Collectors.toList());
    }

    @Override
    public TaskDTO getTaskDetails(String taskCode, EmploymentDTO client) {
        //TODO: do an authentication

        Task task = repository.findByTaskCode(taskCode);

        return mapper.toDTO(task);
    }

    @Transactional
    @Override
    public TaskDTO editTask(String taskCode, TaskDTO dto) throws AccessDeniedException {

        Task task = repository.findByTaskCode(taskCode);
        if (task == null)
            throw new NullPointerException("There is not such a task!");

        String clientID = SecurityContextHolder.getContext().getAuthentication().getName();

        authorizationManager.checkAccess(clientID, task.getUnit().getUnitCode(), task.getOwner().getEmployee().getAccount().getAccountID(), ActionType.EDIT_TASK);

        updateEntity(task, dto);

        repository.save(task);

        return mapper.toDTO(task);
    }

    private void updateEntity(Task task, TaskDTO dto) {

        if (dto.getTitle() != null && !dto.getTitle().isEmpty()) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null && !dto.getDescription().isEmpty()) task.setDescription(dto.getDescription());
        if (dto.getStartTime() != null || dto.getWorkMinutes() != null || dto.getEndTime() != null || dto.getDeadline() != null){ // if one of them is changed so we must reschedule
            rescheduleService.createReschedule(dto);
            if (dto.getStartTime() != null) task.setStartTime(dto.getStartTime());
            if (dto.getEndTime() != null) task.setEndTime(dto.getEndTime());
            if (dto.getDeadline() != null) task.setDeadline(dto.getDeadline());
            if (dto.getWorkMinutes() != null) task.setWorkMinutes(dto.getWorkMinutes());
        }
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getTaskStatus() != null){
            task.setTaskStatus(taskStatusMapper.toEntity(dto.getTaskStatus()));
            List<TaskStatus> taskStatusList = task.getTaskStatusHistory();
            taskStatusList.add(task.getTaskStatus());
            task.setTaskStatusHistory(taskStatusList);
        }
        // TODO : Implement task weight changes
        task.setUpdateTime(LocalDateTime.now());
    }

    @Override
    public void deleteTask(String taskCode) throws AccessDeniedException {
        Task task = repository.findByTaskCode(taskCode);
        if (task == null)
            throw new EntityNotFound("Task", "Task Code", taskCode);

        String clientCode = SecurityContextHolder.getContext().getAuthentication().getName();

        authorizationManager.checkAccess(clientCode, task.getUnit().getUnitCode(), task.getOwner().getEmployee().getAccount().getAccountCode(), ActionType.DELETE_TASK);

        repository.deleteById(task.getId());
    }
}